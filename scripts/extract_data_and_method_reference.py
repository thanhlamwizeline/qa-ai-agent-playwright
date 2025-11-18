#!/usr/bin/env python3
"""
Generate HTML reference combining both Page Methods and Test Data with tab navigation.

Usage:
    python scripts/extract_data_and_method_reference.py
    python scripts/extract_data_and_method_reference.py --output DATA_METHODS_REFERENCE.html
"""

import re
from pathlib import Path
from datetime import datetime, timezone
import argparse
from typing import List, Dict
import json


# ============================================================================
# PlaywrightMethod Class and Extraction Functions
# ============================================================================

class PlaywrightMethod:
    """Represents a Playwright method with enhanced metadata."""

    def __init__(self, class_name: str, method_name: str, parameters: str, return_type: str, location: str, method_type: str = "page_object"):
        self.class_name = class_name
        self.method_name = method_name
        self.parameters = parameters
        self.return_type = return_type
        self.location = location
        self.method_type = method_type  # "common" or "page_object"
        self.parsed_params = self._parse_parameters()
        self.purpose = self._infer_purpose()

    def _parse_parameters(self) -> List[Dict[str, str]]:
        """Parse and describe parameters from the method signature."""
        params = []

        if not self.parameters or self.parameters.strip() == "":
            return params

        # Remove outer parentheses and split by comma
        param_string = self.parameters.strip("()")
        if not param_string:
            return params

        # Simple parameter parsing - can be enhanced
        param_parts = [p.strip() for p in param_string.split(',')]

        for param_part in param_parts:
            if ':' in param_part:
                param_name, param_type = param_part.split(':', 1)
                params.append({
                    'name': param_name.strip(),
                    'type': param_type.strip(),
                    'description': self._infer_param_description(param_name.strip(), param_type.strip())
                })
            else:
                params.append({
                    'name': param_part,
                    'type': 'any',
                    'description': 'Parameter'
                })

        return params

    def _infer_param_description(self, param_name: str, param_type: str) -> str:
        """Infer parameter description from name and type."""
        name_lower = param_name.lower()

        # Common parameter patterns
        if 'username' in name_lower or 'user' in name_lower:
            return 'Username for login/identification'
        elif 'password' in name_lower:
            return 'Password for authentication'
        elif 'product' in name_lower and 'name' in name_lower:
            return 'Product name to interact with'
        elif 'product' in name_lower and 'price' in name_lower:
            return 'Product price value'
        elif 'text' in name_lower or 'message' in name_lower:
            return 'Text content or message'
        elif 'xpath' in name_lower or 'selector' in name_lower:
            return 'Element locator/selector'
        elif 'url' in name_lower:
            return 'URL or web address'
        elif 'timeout' in name_lower:
            return 'Timeout duration in milliseconds'
        elif param_type == 'string':
            return 'String value'
        elif param_type == 'number':
            return 'Numeric value'
        elif param_type == 'boolean':
            return 'Boolean true/false value'
        else:
            return f'{param_type} parameter'

    def _infer_purpose(self) -> str:
        """Infer the purpose of this method."""
        method_lower = self.method_name.lower()

        # Navigation methods
        if 'goto' in method_lower or 'navigate' in method_lower:
            return 'Navigate to a specific page or URL'
        elif 'click' in method_lower:
            if 'login' in method_lower:
                return 'Click on login button or link'
            elif 'product' in method_lower:
                return 'Click on a product to view details'
            elif 'cart' in method_lower:
                return 'Click on cart-related element'
            else:
                return 'Click on an element'

        # Input methods
        elif 'fill' in method_lower or 'type' in method_lower:
            return 'Enter text into an input field'
        elif 'clear' in method_lower:
            if 'cart' in method_lower:
                return 'Clear all items from cart'
            else:
                return 'Clear content or reset state'

        # Generic page methods - work for any page type
        else:
            readable_method = re.sub(r'([a-z])([A-Z])', r'\1 \2', self.method_name).lower()
            return f"Perform '{readable_method}' operation"

    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON serialization."""
        return {
            'class_name': self.class_name,
            'method_name': self.method_name,
            'parameters': self.parameters,
            'return_type': self.return_type,
            'location': self.location,
            'method_type': self.method_type,
            'parsed_params': self.parsed_params,
            'purpose': self.purpose,
        }


class LocatorDefinition:
    """Represents a locator defined inside a page object."""

    def __init__(self, class_name: str, property_name: str, assignment: str, location: str):
        self.class_name = class_name
        self.property_name = property_name
        self.assignment = assignment.strip()
        self.location = location

    def to_dict(self) -> Dict:
        return {
            'class_name': self.class_name,
            'property_name': self.property_name,
            'assignment': self.assignment,
            'location': self.location,
        }


def extract_methods_from_common_helpers(file_path: Path, relative_path: str) -> List[PlaywrightMethod]:
    """Extract static methods from CommonActionsHelpers.ts."""
    methods = []

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract class name (same logic as extract_methods_from_page_object)
    class_match = re.search(r'export\s+class\s+(\w+)', content)
    if not class_match:
        return methods

    class_name = class_match.group(1)

    # Pattern to match static async methods AND instance async methods
    method_pattern = re.compile(
        r'(?:static\s+)?async\s+(\w+)\s*\(([^)]*)\)\s*(?::\s*([^{]+))?\s*{',
        re.MULTILINE
    )

    for match in method_pattern.finditer(content):
        method_name = match.group(1)
        parameters = match.group(2) if match.group(2) else ""
        return_type = match.group(3).strip() if match.group(3) else "Promise<void>"

        # Find line number
        line_num = content[:match.start()].count('\n') + 1
        location = f'{relative_path}:{line_num}'

        method = PlaywrightMethod(
            class_name=class_name,
            method_name=method_name,
            parameters=parameters,
            return_type=return_type,
            location=location,
            method_type="page_object"
        )
        methods.append(method)

    return methods


def extract_methods_from_page_object(file_path: Path, relative_path: str) -> List[PlaywrightMethod]:
    """Extract methods from a page object file."""
    methods = []

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract class name
    class_match = re.search(r'export\s+class\s+(\w+)', content)
    if not class_match:
        return methods

    class_name = class_match.group(1)

    # Pattern to match class methods (both async and sync)
    method_pattern = re.compile(
        r'^\s*(?:async\s+)?(\w+)\s*\(([^)]*)\)\s*(?::\s*([^{]+))?\s*\{',
        re.MULTILINE
    )

    for match in method_pattern.finditer(content):
        method_name = match.group(1)

        # Skip constructor, control structures, proxy handlers, and non-method patterns
        if method_name in ['constructor', 'class', 'export', 'import', 'if', 'for', 'while', 'switch', 'catch', 'try', 'else', 'createProxy', 'get', 'set', 'has', 'apply', 'return', 'function']:
            continue

        # Skip private methods (starting with underscore)
        if method_name.startswith('_'):
            continue

        parameters = match.group(2) if match.group(2) else ""
        return_type = match.group(3).strip() if match.group(3) else "Promise<void>"

        # Find line number
        line_num = content[:match.start()].count('\n') + 1
        location = f'{relative_path}:{line_num}'

        method = PlaywrightMethod(
            class_name=class_name,
            method_name=method_name,
            parameters=parameters,
            return_type=return_type,
            location=location,
            method_type="page_object"
        )
        methods.append(method)

    return methods


def extract_locators_from_page_object(file_path: Path, relative_path: str):
    """Extract locator definitions from a page object file."""
    locators: List[LocatorDefinition] = []

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    class_match = re.search(r'export\s+class\s+(\w+)', content)
    if not class_match:
        return None, locators

    class_name = class_match.group(1)

    locator_pattern = re.compile(
        r'^\s*private\s+(?:readonly\s+)?(\w+)\s*:\s*Locator\s*;',
        re.MULTILINE
    )

    locator_names = []
    for match in locator_pattern.finditer(content):
        property_name = match.group(1)
        line_num = content[:match.start()].count('\n') + 1
        location = f'{relative_path}:{line_num}'
        locator_names.append((property_name, location))

    assignment_pattern = re.compile(
        r'this\.(\w+)\s*=\s*([^;]+);',
        re.MULTILINE | re.DOTALL
    )

    assignment_map = {}
    for match in assignment_pattern.finditer(content):
        property_name = match.group(1)
        assignment = match.group(2).strip()
        assignment_map[property_name] = re.sub(r'\s+', ' ', assignment)

    for property_name, location in locator_names:
        assignment = assignment_map.get(property_name, 'Not assigned')
        locators.append(LocatorDefinition(class_name, property_name, assignment, location))

    return class_name, locators


# ============================================================================
# TestDataObject Class and Extraction Function
# ============================================================================

class TestDataObject:
    """Represents a test data object with metadata."""

    def __init__(self, name: str, file_path: str, raw_value: str):
        self.name = name
        self.file_path = file_path
        self.raw_value = raw_value.strip()
        self.category = self._infer_category()

    def _infer_category(self) -> str:
        """Infer category from file path dynamically."""
        # Special case for constants.ts at root of data folder
        if 'constants.ts' in self.file_path and self.file_path.count('/') == 1:
            return 'constants'

        # Extract category from folder structure (data/folderName/file.ts)
        parts = self.file_path.split('/')
        if len(parts) >= 2:
            # Get the immediate parent folder name
            folder_name = parts[-2] if parts[-2] != 'data' else parts[-1].replace('.ts', '')
            # Convert folder name to category (e.g., 'loginUser' -> 'login-user-data')
            # Handle camelCase and convert to kebab-case
            category = re.sub(r'(?<!^)(?=[A-Z])', '-', folder_name).lower()
            return f'{category}-data'

        return 'other-data'

    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON serialization."""
        return {
            'name': self.name,
            'file': self.file_path,
            'raw_value': self.raw_value,
            'category': self.category
        }


def extract_data_from_file(file_path: Path, relative_path: str) -> List[TestDataObject]:
    """Extract data objects from a TypeScript data file."""
    data_objects = []

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match exported const declarations (both objects and arrays)
    # Capture everything from = to ; including newlines and indentation
    export_pattern = re.compile(
        r'export\s+const\s+(\w+)(?::[^=]+)?\s*=\s*([\s\S]*?);',
        re.MULTILINE
    )

    for match in export_pattern.finditer(content):
        name = match.group(1)
        raw_value = match.group(2)

        # Remove leading and trailing whitespace/newlines
        raw_value = raw_value.strip()

        # Find minimum indentation (excluding empty lines)
        lines = raw_value.split('\n')
        non_empty_lines = [line for line in lines if line.strip()]

        if non_empty_lines:
            min_indent = min(len(line) - len(line.lstrip()) for line in non_empty_lines)
            # Remove the minimum indentation from all lines
            dedented_lines = []
            for line in lines:
                if line.strip():  # Non-empty line
                    dedented_lines.append(line[min_indent:] if len(line) > min_indent else line)
                else:  # Empty line
                    dedented_lines.append('')
            raw_value = '\n'.join(dedented_lines).strip()
        else:
            raw_value = raw_value.strip()

        data_obj = TestDataObject(name, relative_path, raw_value)
        data_objects.append(data_obj)

    return data_objects


# ============================================================================
# Combined HTML Generation
# ============================================================================


def generate_combined_html(
    all_methods: List[PlaywrightMethod],
    all_data: List[TestDataObject],
    locators_by_class: Dict[str, List[LocatorDefinition]],
    output_file: str = 'DATA_METHODS_REFERENCE.html'
):
    """Generate combined HTML documentation with tabs for methods and data."""

    # Process methods
    page_methods = [m for m in all_methods if m.method_type == "page_object"]
    methods_by_class = {}
    for method in page_methods:
        if method.class_name not in methods_by_class:
            methods_by_class[method.class_name] = []
        methods_by_class[method.class_name].append(method)
    methods_json = [m.to_dict() for m in all_methods]
    locator_json = []
    for locator_list in locators_by_class.values():
        locator_json.extend([locator.to_dict() for locator in locator_list])

    # Process data
    data_by_category = {}
    for data_obj in all_data:
        if data_obj.category not in data_by_category:
            data_by_category[data_obj.category] = []
        data_by_category[data_obj.category].append(data_obj)
    data_json = [d.to_dict() for d in all_data]

    def get_display_name(category: str) -> str:
        """Convert category key to display name."""
        if category == 'constants':
            return 'Constants'
        name = category.replace('-data', '').replace('-', ' ').title()
        return f'{name} Data' if not category == 'constants' else name

    def sort_categories(categories):
        """Sort categories with 'constants' first, then alphabetically."""
        sorted_cats = sorted(categories)
        if 'constants' in sorted_cats:
            sorted_cats.remove('constants')
            sorted_cats.insert(0, 'constants')
        return sorted_cats

    sorted_categories = sort_categories(data_by_category.keys())
    total_locators = sum(len(locs) for locs in locators_by_class.values())

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Methods, Locators & Test Data Reference for AI Test Case Generation</title>
    <style>
        :root {{
            --primary-color: #2196F3;
            --primary-dark: #1565C0;
            --primary-rgb: 33, 150, 243;
        }}

        body.theme-purple {{
            --primary-color: #667eea;
            --primary-dark: #764ba2;
            --primary-rgb: 102, 126, 234;
        }}

        body.theme-blue {{
            --primary-color: #2196F3;
            --primary-dark: #1565C0;
            --primary-rgb: 33, 150, 243;
        }}

        body.theme-green {{
            --primary-color: #4CAF50;
            --primary-dark: #2E7D32;
            --primary-rgb: 76, 175, 80;
        }}

        body.theme-light {{
            --primary-color: #607D8B;
            --primary-dark: #455A64;
            --primary-rgb: 96, 125, 139;
        }}

        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }}

        .container {{
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }}

        .header {{
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 20px 0;
            margin-bottom: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            position: relative;
        }}

        .header h1 {{
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 300;
        }}

        .header p {{
            font-size: 1.1rem;
            opacity: 0.9;
            margin-bottom: 5px;
        }}

        .theme-selector {{
            position: absolute;
            top: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }}

        .theme-label {{
            color: white;
            font-size: 13px;
            font-weight: 600;
            opacity: 0.95;
        }}

        .theme-dropdown {{
            background: rgba(255, 255, 255, 0.95);
            border: 0px solid rgba(255, 255, 255, 0.8);
            border-radius: 8px;
            padding: 2px 4px;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            outline: none;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            padding-right: 25px;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 5px center;
            background-size: 15px;
            color: #333;
        }}

        .theme-dropdown:hover {{
            background-color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transform: translateY(-1px);
        }}

        .theme-dropdown:focus {{
            border-color: white;
            box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
        }}

        .tabs {{
            background: white;
            border-radius: 12px;
            padding: 0;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }}

        .tab-buttons {{
            display: flex;
            gap: 10px;
            padding: 10px;
            background: #f1f3f5;
        }}

        .tab-button {{
            flex: 1;
            padding: 12px 24px;
            background: white;
            border: 2px solid transparent;
            border-radius: 10px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            color: #495057;
            transition: all 0.3s ease;
            position: relative;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}

        .tab-button:hover {{
            background: #f8f9fa;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }}

        .tab-button.active {{
            color: white;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
            border-color: var(--primary-color);
            box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4);
            transform: translateY(-2px);
        }}

        .tab-content {{
            display: none;
        }}

        .tab-content.active {{
            display: block;
        }}

        .search-container {{
            background: white;
            border-radius: 12px;
            padding: 15px 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}

        .search-wrapper {{
            position: relative;
            display: flex;
            align-items: center;
        }}

        .search-box {{
            width: 100%;
            padding: 15px 50px 15px 20px;
            font-size: 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            transition: border-color 0.3s ease;
        }}

        .search-box:focus {{
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        }}

        .search-clear {{
            position: absolute;
            right: 15px;
            background: none;
            border: none;
            font-size: 18px;
            color: #6c757d;
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
            display: none;
        }}

        .search-clear:hover {{
            background-color: #f8f9fa;
            color: #495057;
        }}

        .search-clear.visible {{
            display: block;
        }}

        .search-help {{
            margin-top: 15px;
            font-size: 14px;
            color: #6c757d;
        }}

        .search-results {{
            margin-top: 20px;
        }}

        .search-stats {{
            margin-bottom: 15px;
            font-size: 14px;
            color: #6c757d;
        }}

        .search-section-title {{
            margin: 25px 0 10px;
            font-size: 16px;
            font-weight: 600;
            color: #495057;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}

        .no-results {{
            text-align: center;
            padding: 40px;
            color: #6c757d;
            font-style: italic;
        }}

        .section {{
            background: white;
            border-radius: 12px;
            margin-bottom: 30px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}

        .section-header {{
            background: var(--primary-color);
            color: white;
            padding: 15px 20px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background-color 0.2s ease;
        }}

        .section-header:hover {{
            background: #5a6fd8;
        }}

        .section-toggle {{
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
        }}

        .section-toggle:hover {{
            background: rgba(255,255,255,0.2);
        }}

        .section-content {{
            overflow: visible;
            transition: max-height 0.3s ease;
        }}

        .section-content.collapsed {{
            max-height: 0;
            overflow: hidden;
        }}

        .table-wrapper {{
            width: 100%;
            overflow-x: auto;
        }}

        .data-table {{
            width: 100%;
            border-collapse: collapse;
            background: white;
        }}

        .data-table th {{
            background: #f8f9fa;
            padding: 15px 20px;
            text-align: left;
            font-weight: 600;
            color: #495057;
            border-bottom: 2px solid #e9ecef;
            font-size: 14px;
        }}

        .data-table td {{
            padding: 15px 20px;
            border-bottom: 1px solid #f1f3f4;
            vertical-align: top;
        }}

        .data-table tr:last-child td {{
            border-bottom: none;
        }}

        .data-table tr:hover {{
            background-color: #f8f9fa;
        }}

        .data-name {{
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 16px;
            font-weight: bold;
            color: var(--primary-color);
            display: block;
            margin-bottom: 5px;
        }}

        .data-location {{
            font-family: monospace;
            color: #6c757d;
            font-size: 12px;
        }}

        .code-block {{
            background: #2d3748;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 8px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.6;
            position: relative;
            white-space: pre-wrap;
            word-break: break-word;
            overflow-y: auto;
            overflow-x: auto;
            max-height: calc(10 * 1.6em + 30px);
        }}

        .code-block.collapsed {{
            max-height: calc(3 * 1.6em + 30px);
            overflow: hidden;
        }}

        .code-block.collapsed::after {{
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1.5em;
            background: linear-gradient(to bottom, transparent, #2d3748);
            pointer-events: none;
        }}

        .show-more-btn {{
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            margin-top: 8px;
            transition: background-color 0.2s ease;
        }}

        .show-more-btn:hover {{
            background: #5a6fd8;
        }}

        .copy-btn {{
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s ease;
        }}

        .copy-btn:hover {{
            background: rgba(255,255,255,0.3);
        }}

        .copy-btn.copied {{
            background: #28a745;
            color: white;
        }}

        .copy-icon-btn {{
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            padding: 2px 6px;
            margin-left: 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
            vertical-align: middle;
        }}

        .copy-icon-btn:hover {{
            background: rgba(255,255,255,0.2);
            transform: scale(1.1);
        }}

        .copy-icon-btn.copied {{
            transform: scale(1.2);
        }}

        .highlight {{
            background-color: #ff6b6b;
            color: white;
            padding: 2px 4px;
            border-radius: 3px;
            font-weight: bold;
        }}

        .toc {{
            background: white;
            border-radius: 12px;
            padding: 10px 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}

        .toc-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 10px 0;
        }}

        .toc-header h3 {{
            margin: 0;
            color: #495057;
        }}

        .toc-toggle {{
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: var(--primary-color);
            transition: transform 0.3s ease;
            padding: 4px;
            border-radius: 4px;
        }}

        .toc-toggle:hover {{
            background: #f8f9fa;
        }}

        .toc-content {{
            overflow: hidden;
            transition: max-height 0.3s ease;
            max-height: 2000px;
        }}

        .toc-content.collapsed {{
            max-height: 0;
        }}

        .toc-list {{
            list-style: none;
            margin-top: 20px;
        }}

        .toc-list li {{
            margin-bottom: 8px;
        }}

        .toc-list a {{
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            border-radius: 6px;
            transition: background-color 0.2s ease;
        }}

        .toc-list a:hover {{
            background-color: #f8f9fa;
            text-decoration: underline;
        }}

        .item-count {{
            background: #e9ecef;
            color: #6c757d;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: normal;
        }}

        .steps-table {{
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            table-layout: fixed;
        }}

        .steps-table th {{
            background: #f8f9fa;
            padding: 15px 20px;
            text-align: left;
            font-weight: 600;
            color: #495057;
            border-bottom: 2px solid #e9ecef;
        }}

        .steps-table td {{
            padding: 15px 20px;
            border-bottom: 1px solid #f1f3f4;
            vertical-align: top;
            text-align: left;
        }}

        .steps-table tr:hover {{
            background-color: #f8f9fa;
        }}

        .steps-table tr:last-child td {{
            border-bottom: none;
        }}

        .table-step-pattern {{
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 13px;
            background: #2d3748;
            color: #e2e8f0;
            padding: 8px 12px;
            border-radius: 6px;
            margin-bottom: 5px;
            white-space: nowrap;
            overflow-x: auto;
            position: relative;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }}

        .step-text {{
            flex: 1;
            white-space: nowrap;
            overflow-x: auto;
            text-align: left;
            min-width: 0;
        }}

        .table-step-type {{
            color: #4ade80;
            font-weight: bold;
            font-size: 14px;
        }}

        .table-parameters {{
            font-size: 13px;
        }}

        .table-param-item {{
            background: #f8f9fa;
            padding: 4px 8px;
            margin: 2px 0;
            border-radius: 4px;
            border-left: 3px solid #28a745;
        }}

        .table-param-type {{
            font-family: monospace;
            background: #e9ecef;
            padding: 1px 4px;
            border-radius: 3px;
            font-weight: bold;
            color: #495057;
            font-size: 11px;
        }}

        .table-purpose {{
            font-size: 13px;
            color: #6c757d;
        }}

        .table-location {{
            font-family: monospace;
            font-size: 11px;
            color: var(--primary-color);
        }}

        .locator-section {{
            margin-bottom: 25px;
        }}

        .locator-section-header {{
            background: #f1f3f5;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 8px 12px;
            font-weight: 600;
            color: #495057;
            margin-bottom: 12px;
            letter-spacing: 0.5px;
        }}

        .locator-grid {{
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
        }}

        .locator-card {{
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 10px;
            padding: 12px 14px 12px 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            display: flex;
            gap: 8px;
            align-items: center;
        }}

        .locator-name {{
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 14px;
            font-weight: bold;
            color: var(--primary-color);
            min-width: 140px;
            word-break: break-word;
            display: flex;
            align-items: center;
        }}

        .locator-definition {{
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 13px;
            background: #2d3748;
            color: #e2e8f0;
            padding: 8px 12px;
            border-radius: 6px;
            word-break: break-word;
        }}

        .empty-state {{
            padding: 15px 20px;
            font-size: 14px;
            color: #6c757d;
            font-style: italic;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px dashed #dee2e6;
            margin-bottom: 20px;
        }}

        @media (max-width: 768px) {{
            .container {{
                padding: 10px;
            }}

            .header h1 {{
                font-size: 2rem;
            }}

            .theme-selector {{
                position: static;
                justify-content: center;
                margin-bottom: 15px;
            }}

            .theme-label {{
                font-size: 11px;
            }}

            .theme-dropdown {{
                font-size: 18px;
                padding: 4px 8px;
                padding-right: 22px;
            }}

            .tab-button {{
                padding: 15px 10px;
                font-size: 14px;
            }}

            .data-table th,
            .data-table td {{
                padding: 10px;
            }}

            .locator-grid {{
                grid-template-columns: 1fr;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="theme-selector">
                <span class="theme-label">Theme:</span>
                <select class="theme-dropdown" id="themeDropdown" onchange="changeTheme(this.value)">
                    <option value="purple">🟣</option>
                    <option value="blue" selected>🔵</option>
                    <option value="green">🟢</option>
                    <option value="light">⚪</option>
                </select>
            </div>
            <h1>Page Methods, Locators & Test Data Reference</h1>
            <p>For AI Test Case Generation</p>
            <p style="font-size: 0.8em;">(Last generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')} - UTC)</p>
        </div>

        <div class="tabs">
            <div class="tab-buttons">
                <button class="tab-button active" onclick="switchTab('methods')">
                    Page Methods & Locators
                </button>
                <button class="tab-button" onclick="switchTab('data')">
                    Test Data
                </button>
            </div>
        </div>

        <!-- METHODS TAB -->
        <div id="methods-tab" class="tab-content active">
"""

    # Add methods search
    html_content += f"""
            <div class="search-container">
                <div class="search-wrapper">
                    <input type="text" id="methodsSearchBox" class="search-box" placeholder="Search methods, locators... (e.g., 'login', 'verify', 'click')" autocomplete="off">
                    <button id="methodsSearchClear" class="search-clear" onclick="clearMethodsSearch()">✕</button>
                </div>
                <div class="search-help">
                    💡 <strong>Search tips:</strong> Type method names, class names, or keywords to find relevant methods.
                </div>
                <div id="methodsSearchResults" class="search-results"></div>
            </div>

            <div id="methodsTableOfContents" class="toc">
                <div class="toc-header" onclick="toggleMethodsToc()">
                    <h3>Table of Contents</h3>
                    <button class="toc-toggle" id="methodsTocToggle">▼</button>
                </div>
                <div class="toc-content" id="methodsTocContent">
                    <ul class="toc-list">
"""

    # Separate helper classes from page objects, display helpers first
    all_class_names_set = set(list(methods_by_class.keys()) + list(locators_by_class.keys()))

    # Identify helper classes (those that come from helpers folder)
    helper_classes = []
    page_object_classes = []

    for class_name in all_class_names_set:
        # Check if this class has methods from helpers folder
        is_helper = False
        for method in methods_by_class.get(class_name, []):
            if method.location.startswith('helpers/'):
                is_helper = True
                break

        if is_helper:
            helper_classes.append(class_name)
        else:
            page_object_classes.append(class_name)

    # Sort each group and combine: page objects first, then helpers
    all_class_names = sorted(page_object_classes) + sorted(helper_classes)

    for class_name in all_class_names:
        method_count = len(methods_by_class.get(class_name, []))
        locator_count = len(locators_by_class.get(class_name, []))
        anchor = class_name.lower()
        html_content += f'                        <li><a href="#{anchor}">{class_name} <span class="item-count">{method_count} methods + {locator_count} locators</span></a></li>\n'

    html_content += """                    </ul>
                </div>
            </div>

            <div id="allMethods">
"""

    # Add Page Object sections
    for class_name in all_class_names:
        methods = methods_by_class.get(class_name, [])
        locators = locators_by_class.get(class_name, [])
        method_count = len(methods)
        locator_count = len(locators)
        anchor = class_name.lower()

        html_content += f"""
            <div class="section" id="{anchor}">
                <div class="section-header" onclick="toggleSection('{anchor}')">
                    <span>{class_name} ({method_count} methods + {locator_count} locators)</span>
                    <button class="section-toggle" id="toggle_{anchor}">▼</button>
                </div>
                <div class="section-content" id="content_{anchor}">
"""

        if locators:
            html_content += """
                    <div class="locator-section">
                        <div class="locator-section-header">Locators</div>
                        <div class="locator-grid">
"""
            for locator in locators:
                html_content += f"""
                            <div class="locator-card">
                                <div class="locator-name">{locator.property_name}</div>
                                <div class="locator-definition">{locator.assignment}</div>
                            </div>
"""
            html_content += """
                        </div>
                    </div>
"""
        else:
            html_content += """
                    <div class="empty-state">No locators detected for this page object.</div>
"""

        if methods:
            html_content += """
                    <div class="table-wrapper">
                        <table class="steps-table">
                            <thead>
                                <tr>
                                    <th style="width: 50%; text-align: left;">Method</th>
                                    <th style="width: 25%;">Parameters</th>
                                    <th style="width: 25%;">Purpose</th>
                                </tr>
                            </thead>
                            <tbody>
"""

            for method in methods:
                params_html = "None"
                if method.parsed_params:
                    params_html = ""
                    for param in method.parsed_params:
                        params_html += f'<div class="table-param-item"><span class="table-param-type">{param["name"]}: {param["type"]}</span> - {param["description"]}</div>'

                html_content += f"""
                            <tr>
                                <td>
                                    <div class="table-step-pattern">
                                        <div class="step-text scrollable">
                                            <span class="table-step-type">{method.method_name}</span>({method.parameters})
                                        </div>
                                        <button class="copy-btn" onclick="copyMethodSignature('{method.method_name}', this)">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <div class="table-parameters">{params_html}</div>
                                </td>
                                <td>
                                    <div class="table-purpose">{method.purpose}</div>
                                </td>
                            </tr>
"""

            html_content += """
                            </tbody>
                        </table>
                    </div>
"""
        else:
            html_content += """
                    <div class="empty-state">No methods detected for this page object.</div>
"""

        html_content += """
                </div>
            </div>
"""

    html_content += """
            </div>
        </div>

        <!-- DATA TAB -->
        <div id="data-tab" class="tab-content">
"""

    # Add data search
    html_content += """
            <div class="search-container">
                <div class="search-wrapper">
                    <input type="text" id="dataSearchBox" class="search-box" placeholder="Search test data... (e.g., 'USERS', 'PRODUCTS', 'LOGIN_USER')" autocomplete="off">
                    <button id="dataSearchClear" class="search-clear" onclick="clearDataSearch()">✕</button>
                </div>
                <div class="search-help">
                    💡 <strong>Search tips:</strong> Type data object names or content to find relevant test data.
                </div>
                <div id="dataSearchResults" class="search-results"></div>
            </div>

            <div id="dataTableOfContents" class="toc">
                <div class="toc-header" onclick="toggleDataToc()">
                    <h3>Table of Contents</h3>
                    <button class="toc-toggle" id="dataTocToggle">▼</button>
                </div>
                <div class="toc-content" id="dataTocContent">
                    <ul class="toc-list">
"""

    for category in sorted_categories:
        count = len(data_by_category[category])
        display_name = get_display_name(category)
        html_content += f'                        <li><a href="#{category}">{display_name} <span class="item-count">{count} object{"s" if count > 1 else ""}</span></a></li>\n'

    html_content += """                    </ul>
                </div>
            </div>

            <div id="allData">
"""

    # Generate data sections
    for category in sorted_categories:
        data_objs = data_by_category[category]
        display_name = get_display_name(category)
        file_path = data_objs[0].file_path if data_objs else ""

        html_content += f"""
            <div class="section" id="{category}">
                <div class="section-header" onclick="toggleSection('{category}')">
                    <span>{display_name} ({file_path}) <button class="copy-icon-btn" onclick="event.stopPropagation(); copyPath(this, '{file_path}')" title="Copy file path"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button></span>
                    <button class="section-toggle" id="toggle_{category}">▼</button>
                </div>
                <div class="section-content" id="content_{category}">
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th style="width: 25%;">Data Name</th>
                                    <th style="width: 75%;">Detail</th>
                                </tr>
                            </thead>
                            <tbody>
"""

        for data_obj in data_objs:
            lines = data_obj.raw_value.split('\n')
            needs_show_more = len(lines) > 3
            collapsed_class = ' collapsed' if needs_show_more else ''

            html_content += f"""                                <tr>
                                    <td>
                                        <span class="data-name">{data_obj.name}</span>
                                        <span class="data-location">{data_obj.file_path}</span>
                                    </td>
                                    <td>
                                        <div class="code-block{collapsed_class}" id="code-{data_obj.name}">{data_obj.raw_value}</div>
"""
            if needs_show_more:
                html_content += f"""                                        <button class="show-more-btn" onclick="toggleShowMore('code-{data_obj.name}', this)">Show More</button>
"""

            html_content += """                                    </td>
                                </tr>
"""

        html_content += """                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
"""

    html_content += """
            </div>
        </div>
    </div>

    <script>
"""

    # Add JavaScript
    html_content += f"""
        // Theme switching
        function changeTheme(theme) {{
            // Remove all theme classes
            document.body.className = document.body.className.replace(/theme-\\w+/g, '');
            // Add new theme class
            document.body.classList.add('theme-' + theme);

            // Save preference
            localStorage.setItem('preferredTheme', theme);
        }}

        // Load saved theme on page load
        document.addEventListener('DOMContentLoaded', function() {{
            const savedTheme = localStorage.getItem('preferredTheme') || 'blue';
            document.body.classList.add('theme-' + savedTheme);

            // Update dropdown selection
            const dropdown = document.getElementById('themeDropdown');
            if (dropdown) {{
                dropdown.value = savedTheme;
            }}
        }});

        // Tab switching
        function switchTab(tabName) {{
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {{
                tab.classList.remove('active');
            }});
            document.querySelectorAll('.tab-button').forEach(btn => {{
                btn.classList.remove('active');
            }});

            // Show selected tab
            document.getElementById(tabName + '-tab').classList.add('active');
            event.target.classList.add('active');

            // Clear searches when switching tabs
            if (tabName === 'methods') {{
                clearDataSearch();
            }} else {{
                clearMethodsSearch();
            }}
        }}

        // Methods data
        const methodDefinitions = {json.dumps(methods_json, indent=2)};

        // Locator data
        const locatorDefinitions = {json.dumps(locator_json, indent=2)};

        // Data definitions
        const dataDefinitions = {json.dumps(data_json, indent=8)};

        // Methods search
        const methodsSearchBox = document.getElementById('methodsSearchBox');
        const methodsSearchClear = document.getElementById('methodsSearchClear');
        const methodsSearchResults = document.getElementById('methodsSearchResults');
        const allMethods = document.getElementById('allMethods');
        const methodsTableOfContents = document.getElementById('methodsTableOfContents');

        let methodsSearchTimeout;

        methodsSearchBox.addEventListener('input', function() {{
            clearTimeout(methodsSearchTimeout);
            methodsSearchTimeout = setTimeout(() => {{
                performMethodsSearch(this.value.trim());
                toggleMethodsSearchClearButton();
            }}, 300);
        }});

        function toggleMethodsSearchClearButton() {{
            if (methodsSearchBox.value.length > 0) {{
                methodsSearchClear.classList.add('visible');
            }} else {{
                methodsSearchClear.classList.remove('visible');
            }}
        }}

        function clearMethodsSearch() {{
            methodsSearchBox.value = '';
            methodsSearchClear.classList.remove('visible');
            showAllMethods();
            methodsSearchBox.focus();
        }}

        function performMethodsSearch(query) {{
            if (!query) {{
                showAllMethods();
                return;
            }}

            const methodResults = searchMethods(query);
            const locatorResults = searchLocators(query);
            displayMethodsSearchResults(methodResults, locatorResults, query);
        }}

        function searchMethods(query) {{
            const queryLower = query.toLowerCase();
            const results = [];

            methodDefinitions.forEach(method => {{
                let score = 0;
                let matches = [];

                if (method.method_name.toLowerCase().includes(queryLower)) {{
                    score += 100;
                    matches.push('method_name');
                }}

                if (method.class_name.toLowerCase().includes(queryLower)) {{
                    score += 80;
                    matches.push('class_name');
                }}

                if (method.purpose.toLowerCase().includes(queryLower)) {{
                    score += 50;
                    matches.push('purpose');
                }}

                method.parsed_params.forEach(param => {{
                    if (param.name.toLowerCase().includes(queryLower)) {{
                        score += 30;
                        matches.push('parameter');
                    }}
                }});

                const queryWords = queryLower.split(/\\s+/);
                queryWords.forEach(word => {{
                    if (word.length > 2) {{
                        if (method.method_name.toLowerCase().includes(word)) score += 20;
                        if (method.class_name.toLowerCase().includes(word)) score += 15;
                        if (method.purpose.toLowerCase().includes(word)) score += 10;
                    }}
                }});

                if (score > 0) {{
                    results.push({{
                        method: method,
                        score: score,
                        matches: matches
                    }});
                }}
            }});

            results.sort((a, b) => b.score - a.score);
            return results;
        }}

        function searchLocators(query) {{
            const queryLower = query.toLowerCase();
            const results = [];

            locatorDefinitions.forEach(locator => {{
                let score = 0;
                let matches = [];

                if (locator.property_name.toLowerCase().includes(queryLower)) {{
                    score += 100;
                    matches.push('property_name');
                }}

                if (locator.class_name.toLowerCase().includes(queryLower)) {{
                    score += 70;
                    matches.push('class_name');
                }}

                if (locator.assignment.toLowerCase().includes(queryLower)) {{
                    score += 60;
                    matches.push('assignment');
                }}

                const queryWords = queryLower.split(/\\s+/);
                queryWords.forEach(word => {{
                    if (word.length > 2) {{
                        if (locator.property_name.toLowerCase().includes(word)) score += 20;
                        if (locator.class_name.toLowerCase().includes(word)) score += 15;
                        if (locator.assignment.toLowerCase().includes(word)) score += 10;
                    }}
                }});

                if (score > 0) {{
                    results.push({{
                        locator: locator,
                        score: score,
                        matches: matches
                    }});
                }}
            }});

            results.sort((a, b) => b.score - a.score);
            return results;
        }}

        function displayMethodsSearchResults(methodResults, locatorResults, query) {{
            allMethods.style.display = 'none';
            methodsTableOfContents.style.display = 'none';

            if (methodResults.length === 0 && locatorResults.length === 0) {{
                methodsSearchResults.innerHTML = `
                    <div class="search-stats">No method or locator results found for "${{query}}"</div>
                    <div class="no-results">
                        <p>🔍 No matching methods or locators found.</p>
                        <p>Try searching for keywords from method names, locator names, or assignments.</p>
                    </div>
                `;
                return;
            }}

            const totalMatches = methodResults.length + locatorResults.length;
            let html = `<div class="search-stats">Found ${{totalMatches}} match${{totalMatches !== 1 ? 'es' : ''}} for "${{query}}" (${{methodResults.length}} method${{methodResults.length !== 1 ? 's' : ''}}, ${{locatorResults.length}} locator${{locatorResults.length !== 1 ? 's' : ''}})</div>`;

            if (methodResults.length > 0) {{
                html += `
                    <h4 class="search-section-title">Method Matches (${{methodResults.length}})</h4>
                    <div class="table-wrapper">
                        <table class="steps-table">
                            <thead>
                                <tr>
                                    <th style="width: 50%; text-align: left;">Method</th>
                                    <th style="width: 25%;">Parameters</th>
                                    <th style="width: 25%;">Purpose</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                methodResults.forEach(result => {{
                    const method = result.method;

                    let paramsHtml = "None";
                    if (method.parsed_params && method.parsed_params.length > 0) {{
                        paramsHtml = "";
                        method.parsed_params.forEach(param => {{
                            paramsHtml += `<div class="table-param-item"><span class="table-param-type">${{param.name}}: ${{param.type}}</span> - ${{param.description}}</div>`;
                        }});
                    }}

                    const highlightedMethodName = highlightMatch(method.method_name, query);
                    const highlightedClassName = highlightMatch(method.class_name, query);
                    const highlightedPurpose = highlightMatch(method.purpose, query);

                    html += `
                            <tr>
                                <td>
                                    <div class="table-step-pattern">
                                        <div class="step-text scrollable">
                                            <span class="table-step-type">${{highlightedMethodName}}</span>(${{method.parameters}})
                                        </div>
                                        <button class="copy-btn" onclick="copyMethodSignature('${{method.method_name}}', this)">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <div style="font-size: 11px; color: #6c757d; margin-top: 4px;">
                                        ${{highlightedClassName}}
                                    </div>
                                </td>
                                <td>
                                    <div class="table-parameters">${{paramsHtml}}</div>
                                </td>
                                <td>
                                    <div class="table-purpose">${{highlightedPurpose}}</div>
                                </td>
                            </tr>
                    `;
                }});

                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            }}

            if (locatorResults.length > 0) {{
                html += `
                    <h4 class="search-section-title">Locator Matches (${{locatorResults.length}})</h4>
                    <div class="table-wrapper">
                        <table class="steps-table">
                            <thead>
                                <tr>
                                    <th style="width: 30%; text-align: left;">Locator</th>
                                    <th style="width: 70%;">Definition</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                locatorResults.forEach(result => {{
                    const locator = result.locator;
                    const highlightedLocatorName = highlightMatch(locator.property_name, query);
                    const highlightedAssignment = highlightMatch(locator.assignment, query);
                    const highlightedClassName = highlightMatch(locator.class_name, query);

                    html += `
                            <tr>
                                <td>
                                    <div class="table-step-type">${{highlightedLocatorName}}</div>
                                    <div style="font-size: 11px; color: #6c757d; margin-top: 4px;">
                                        ${{highlightedClassName}}
                                    </div>
                                </td>
                                <td>
                                    <div class="locator-definition">${{highlightedAssignment}}</div>
                                </td>
                            </tr>
                    `;
                }});

                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            }}

            methodsSearchResults.innerHTML = html;
        }}

        function showAllMethods() {{
            methodsSearchResults.innerHTML = '';
            allMethods.style.display = 'block';
            methodsTableOfContents.style.display = 'block';
        }}

        // Data search
        const dataSearchBox = document.getElementById('dataSearchBox');
        const dataSearchClear = document.getElementById('dataSearchClear');
        const dataSearchResults = document.getElementById('dataSearchResults');
        const allData = document.getElementById('allData');
        const dataTableOfContents = document.getElementById('dataTableOfContents');

        let dataSearchTimeout;

        dataSearchBox.addEventListener('input', function() {{
            clearTimeout(dataSearchTimeout);
            dataSearchTimeout = setTimeout(() => {{
                performDataSearch(this.value.trim());
                toggleDataSearchClearButton();
            }}, 300);
        }});

        function toggleDataSearchClearButton() {{
            if (dataSearchBox.value.length > 0) {{
                dataSearchClear.classList.add('visible');
            }} else {{
                dataSearchClear.classList.remove('visible');
            }}
        }}

        function clearDataSearch() {{
            dataSearchBox.value = '';
            dataSearchClear.classList.remove('visible');
            showAllData();
            dataSearchBox.focus();
        }}

        function performDataSearch(query) {{
            if (!query) {{
                showAllData();
                return;
            }}

            const results = searchData(query);
            displayDataSearchResults(results, query);
        }}

        function searchData(query) {{
            const queryLower = query.toLowerCase();
            const results = [];

            dataDefinitions.forEach(data => {{
                let score = 0;

                if (data.name.toLowerCase().includes(queryLower)) {{
                    score += 100;
                }}

                if (data.file.toLowerCase().includes(queryLower)) {{
                    score += 50;
                }}

                if (data.raw_value.toLowerCase().includes(queryLower)) {{
                    score += 30;
                }}

                if (score > 0) {{
                    results.push({{
                        data: data,
                        score: score
                    }});
                }}
            }});

            results.sort((a, b) => b.score - a.score);
            return results;
        }}

        function displayDataSearchResults(results, query) {{
            allData.style.display = 'none';
            dataTableOfContents.style.display = 'none';

            if (results.length === 0) {{
                dataSearchResults.innerHTML = `
                    <div class="search-stats">No results found for "${{query}}"</div>
                    <div class="no-results">
                        <p>🔍 No matching data found.</p>
                        <p>Try searching for data names like "USERS", "PRODUCTS", "LOGIN_USER".</p>
                    </div>
                `;
                return;
            }}

            let html = `<div class="search-stats">Found ${{results.length}} matching data object${{results.length !== 1 ? 's' : ''}} for "${{query}}"</div>`;

            html += `
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width: 25%;">Data Name</th>
                                <th style="width: 75%;">Detail</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            results.forEach(result => {{
                const data = result.data;
                const highlightedName = highlightMatch(data.name, query);
                const highlightedValue = highlightMatch(data.raw_value, query);

                html += `
                            <tr>
                                <td>
                                    <span class="data-name">${{highlightedName}}</span>
                                    <span class="data-location">${{data.file}}</span>
                                </td>
                                <td>
                                    <div class="code-block">${{highlightedValue}}</div>
                                </td>
                            </tr>
                `;
            }});

            html += `
                        </tbody>
                    </table>
                </div>
            `;

            dataSearchResults.innerHTML = html;
        }}

        function showAllData() {{
            dataSearchResults.innerHTML = '';
            allData.style.display = 'block';
            dataTableOfContents.style.display = 'block';
        }}

        function highlightMatch(text, query) {{
            const queryLower = query.toLowerCase();
            const textLower = text.toLowerCase();

            if (!textLower.includes(queryLower)) {{
                return text;
            }}

            const index = textLower.indexOf(queryLower);
            if (index === -1) return text;

            return text.substring(0, index) +
                   '<span class="highlight">' +
                   text.substring(index, index + query.length) +
                   '</span>' +
                   text.substring(index + query.length);
        }}

        // Toggle section
        function toggleSection(sectionId) {{
            const content = document.getElementById('content_' + sectionId);
            const toggle = document.getElementById('toggle_' + sectionId);

            if (content.classList.contains('collapsed')) {{
                content.classList.remove('collapsed');
                content.style.maxHeight = '10000px';
                toggle.textContent = '▼';
            }} else {{
                content.classList.add('collapsed');
                content.style.maxHeight = '0';
                toggle.textContent = '►';
            }}
        }}

        // Toggle TOCs
        function toggleMethodsToc() {{
            const content = document.getElementById('methodsTocContent');
            const toggle = document.getElementById('methodsTocToggle');

            if (content.classList.contains('collapsed')) {{
                content.classList.remove('collapsed');
                content.style.maxHeight = '2000px';
                toggle.textContent = '▼';
            }} else {{
                content.classList.add('collapsed');
                content.style.maxHeight = '0';
                toggle.textContent = '►';
            }}
        }}

        function toggleDataToc() {{
            const content = document.getElementById('dataTocContent');
            const toggle = document.getElementById('dataTocToggle');

            if (content.classList.contains('collapsed')) {{
                content.classList.remove('collapsed');
                content.style.maxHeight = '2000px';
                toggle.textContent = '▼';
            }} else {{
                content.classList.add('collapsed');
                content.style.maxHeight = '0';
                toggle.textContent = '►';
            }}
        }}

        // Toggle show more
        function toggleShowMore(codeId, button) {{
            const codeBlock = document.getElementById(codeId);

            if (codeBlock.classList.contains('collapsed')) {{
                codeBlock.classList.remove('collapsed');
                button.textContent = 'Show Less';
            }} else {{
                codeBlock.classList.add('collapsed');
                button.textContent = 'Show More';
            }}
        }}

        // Copy functions
        function copyMethodSignature(methodText, button) {{
            navigator.clipboard.writeText(methodText).then(function() {{
                const originalText = button.innerHTML;
                button.textContent = 'Copied!';
                button.classList.add('copied');

                setTimeout(function() {{
                    button.innerHTML = originalText;
                    button.classList.remove('copied');
                }}, 1500);
            }}).catch(function(err) {{
                console.error('Failed to copy: ', err);
            }});
        }}

        function copyCode(button, text) {{
            navigator.clipboard.writeText(text).then(function() {{
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('copied');

                setTimeout(function() {{
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }}, 1500);
            }}).catch(function(err) {{
                console.error('Failed to copy: ', err);
            }});
        }}

        function copyPath(button, path) {{
            navigator.clipboard.writeText(path).then(function() {{
                const originalHTML = button.innerHTML;
                button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                button.classList.add('copied');

                setTimeout(function() {{
                    button.innerHTML = originalHTML;
                    button.classList.remove('copied');
                }}, 1500);
            }}).catch(function(err) {{
                console.error('Failed to copy: ', err);
            }});
        }}

        // Initialize on page load
        window.addEventListener('load', function() {{
            methodsSearchBox.focus();

            // Initialize all sections as expanded with large max-height
            const sections = document.querySelectorAll('[id^="content_"]');
            sections.forEach(section => {{
                section.style.maxHeight = '10000px';
            }});

            // Initialize TOCs as expanded with large fixed max-height
            const methodsTocContent = document.getElementById('methodsTocContent');
            methodsTocContent.style.maxHeight = '2000px';

            const dataTocContent = document.getElementById('dataTocContent');
            dataTocContent.style.maxHeight = '2000px';
        }});

        // Clear search with Escape key
        methodsSearchBox.addEventListener('keydown', function(e) {{
            if (e.key === 'Escape') {{
                clearMethodsSearch();
            }}
        }});

        dataSearchBox.addEventListener('keydown', function(e) {{
            if (e.key === 'Escape') {{
                clearDataSearch();
            }}
        }});
    </script>
</body>
</html>"""

    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)

    return output_file


def main():
    parser = argparse.ArgumentParser(description='Generate combined HTML reference for methods and data')
    parser.add_argument(
        '--output',
        '-o',
        default='DATA_METHODS_REFERENCE.html',
        help='Output HTML file (default: DATA_METHODS_REFERENCE.html)'
    )

    args = parser.parse_args()

    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    print(f"Scanning project: {project_root}")

    # Extract methods & locators
    all_methods = []
    locators_by_class: Dict[str, List[LocatorDefinition]] = {}

    # Extract from helpers/*.ts files
    helpers_dir = project_root / 'helpers'
    if helpers_dir.exists():
        ts_files = sorted(helpers_dir.glob('*.ts'))
        for ts_file in ts_files:
            relative_path = f'helpers/{ts_file.name}'
            common_methods = extract_methods_from_common_helpers(ts_file, relative_path)
            if common_methods:
                print(f"   FOUND Methods: {ts_file.name}: {len(common_methods)} methods")
                all_methods.extend(common_methods)

    # Extract from page-objects/*.ts files
    page_objects_dir = project_root / 'page-objects'
    excluded_page_objects = {'POManager.ts', 'BasePage.ts'}

    if page_objects_dir.exists():
        ts_files = sorted(page_objects_dir.glob('*.ts'))
        for ts_file in ts_files:
            if ts_file.name in excluded_page_objects:
                continue
            relative_path = f'page-objects/{ts_file.name}'
            page_methods = extract_methods_from_page_object(ts_file, relative_path)
            if page_methods:
                print(f"   FOUND Methods: {ts_file.name}: {len(page_methods)} methods")
                all_methods.extend(page_methods)
            class_name, locators = extract_locators_from_page_object(ts_file, relative_path)
            if class_name:
                locators_by_class[class_name] = locators

    # Extract data
    all_data = []
    data_dir = project_root / 'data'
    if data_dir.exists():
        ts_files = [f for f in data_dir.rglob('*.ts') if f.name != 'data-interfaces.ts']
        for ts_file in sorted(ts_files):
            relative_path = str(ts_file.relative_to(project_root)).replace('\\', '/')
            data_objects = extract_data_from_file(ts_file, relative_path)
            if data_objects:
                print(f"   FOUND Data: {relative_path}: {len(data_objects)} data object(s)")
                all_data.extend(data_objects)

    if not all_methods and not all_data:
        print("ERROR: No methods or data found")
        return 1

    # Generate combined HTML
    output_path = project_root / args.output
    generate_combined_html(all_methods, all_data, locators_by_class, output_path)

    print(f"\nGenerated: {output_path}")
    print(f"Total: {len(all_methods)} methods, {len(all_data)} data objects")
    print(f"\nHTML document includes:")
    print(f"   - Tab navigation between Methods and Data")
    print(f"   - Interactive search for both sections")
    print(f"   - All features from both reference pages")

    return 0


if __name__ == '__main__':
    exit(main())
