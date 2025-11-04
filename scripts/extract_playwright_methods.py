#!/usr/bin/env python3
"""
Generate HTML version of Playwright native methods with search functionality.

Usage:
    python scripts/extract_playwright_methods.py
    python scripts/extract_playwright_methods.py --output PLAYWRIGHT_METHODS.html
"""

import re
from pathlib import Path
from datetime import datetime, timezone
import argparse
from typing import List, Dict
import json


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
        class_lower = self.class_name.lower()

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

        # Common actions - fallback with camelCase conversion
        elif self.method_type == "common":
            readable_method = re.sub(r'([a-z])([A-Z])', r'\1 \2', self.method_name).lower()
            return f'Execute common utility: {readable_method}'

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


def extract_methods_from_common_helpers(file_path: Path, relative_path: str) -> List[PlaywrightMethod]:
    """Extract static methods from CommonActionsHelpers.ts."""
    methods = []

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match static async methods
    method_pattern = re.compile(
        r'static\s+async\s+(\w+)\s*\(([^)]*)\)\s*(?::\s*([^{]+))?\s*{',
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
            class_name="CommonActions",
            method_name=method_name,
            parameters=parameters,
            return_type=return_type,
            location=location,
            method_type="common"
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


def generate_html(all_methods: List[PlaywrightMethod], output_file: str = 'PLAYWRIGHT_METHODS.html'):
    """Generate HTML documentation with search functionality."""

    # Group by type and class
    common_methods = [m for m in all_methods if m.method_type == "common"]
    page_methods = [m for m in all_methods if m.method_type == "page_object"]

    # Group page methods by class
    methods_by_class = {}
    for method in page_methods:
        if method.class_name not in methods_by_class:
            methods_by_class[method.class_name] = []
        methods_by_class[method.class_name].append(method)

    # Convert methods to JSON for JavaScript
    methods_json = []
    for method in all_methods:
        methods_json.append(method.to_dict())

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Available Page Methods Reference for AI Test Case Generation</title>
    <style>
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
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }}

        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 0;
            margin-bottom: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
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
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
            background: #667eea;
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
            overflow: hidden;
            transition: max-height 0.3s ease;
        }}

        .section-content.collapsed {{
            max-height: 0;
        }}

        .method-item {{
            padding: 25px 30px;
            border-bottom: 1px solid #f1f3f4;
            transition: background-color 0.2s ease;
        }}

        .method-item:last-child {{
            border-bottom: none;
        }}

        .method-item:hover {{
            background-color: #f8f9fa;
        }}

        .method-signature {{
            background: #2d3748;
            color: #e2e8f0;
            padding: 15px 20px;
            border-radius: 8px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 14px;
            margin-bottom: 15px;
            position: relative;
            overflow-x: auto;
        }}

        .method-name {{
            color: #4ade80;
            font-weight: bold;
        }}

        .method-details {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 15px;
        }}

        .detail-item {{
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
        }}

        .detail-label {{
            font-weight: 600;
            color: #495057;
            margin-bottom: 8px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}

        .detail-content {{
            color: #6c757d;
        }}

        .parameters-list {{
            list-style: none;
        }}

        .parameters-list li {{
            margin-bottom: 8px;
            padding: 8px 12px;
            background: white;
            border-radius: 4px;
            border-left: 3px solid #28a745;
        }}

        .param-name {{
            font-family: monospace;
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 3px;
            font-weight: bold;
            color: #495057;
        }}

        .param-type {{
            font-family: monospace;
            color: #667eea;
            font-size: 12px;
        }}

        .example-code {{
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 15px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 14px;
            color: #495057;
            overflow-x: auto;
        }}

        .location-link {{
            font-family: monospace;
            color: #667eea;
            text-decoration: none;
            font-size: 13px;
            background: #f8f9fa;
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid #e9ecef;
        }}

        .location-link:hover {{
            background: #e9ecef;
            text-decoration: underline;
        }}

        .method-type-badge {{
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 10px;
        }}

        .common-badge {{
            background: #28a745;
            color: white;
        }}

        .page-object-badge {{
            background: #007bff;
            color: white;
        }}

        .highlight {{
            background-color: #ff6b6b;
            color: white;
            padding: 2px 4px;
            border-radius: 3px;
            font-weight: bold;
        }}

        .copy-btn {{
            background: rgba(255,255,255,0.2);
            border: none;
            color: #e2e8f0;
            padding: 6px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            position: absolute;
            top: 10px;
            right: 10px;
            transition: background-color 0.2s ease;
        }}

        .copy-btn:hover {{
            background: rgba(255,255,255,0.3);
        }}

        .copy-btn.copied {{
            background: #28a745;
            color: white;
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
            color: #667eea;
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
            color: #667eea;
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

        .method-count {{
            background: #e9ecef;
            color: #6c757d;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: normal;
        }}

        .table-wrapper {{
            width: 100%;
            overflow-x: auto;
        }}

        .steps-table {{
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
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

        .copy-btn {{
            background: rgba(255,255,255,0.2);
            border: none;
            color: #e2e8f0;
            padding: 6px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-left: auto;
            margin-right: 0;
            transition: background-color 0.2s ease;
            flex-shrink: 0;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
        }}

        .copy-btn:hover {{
            background: rgba(255,255,255,0.3);
        }}

        .copy-btn.copied {{
            background: #28a745;
            color: white;
        }}

        .table-step-type {{
            color: #4ade80;
            font-weight: bold;
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
            color: #667eea;
        }}

        .scrollable {{
            overflow-x: auto;
            white-space: nowrap;
            max-width: 100%;
        }}

        .scrollable::-webkit-scrollbar {{
            height: 6px;
        }}

        .scrollable::-webkit-scrollbar-thumb {{
            background-color: #ccc;
            border-radius: 3px;
        }}

        @media (max-width: 768px) {{
            .container {{
                padding: 10px;
            }}

            .header h1 {{
                font-size: 2rem;
            }}

            .method-details {{
                grid-template-columns: 1fr;
            }}

            .search-container, .section, .toc {{
                padding: 20px;
            }}

            .method-item {{
                padding: 20px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Available Page Methods Reference for AI Test Case Generation</h1>
            <p>Total Methods: {len(all_methods)} <span style="font-size: 0.8em;">(Last generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')} - UTC)</span></p>
        </div>

        <div class="search-container">
            <div class="search-wrapper">
                <input type="text" id="searchBox" class="search-box" placeholder="Search methods... (e.g., 'login', 'verify', 'click', 'clearCart')" autocomplete="off">
                <button id="searchClear" class="search-clear" onclick="clearSearch()">✕</button>
            </div>
            <div class="search-help">
                💡 <strong>Search tips:</strong> Type method names, class names, or keywords to find relevant methods.
            </div>
            <div id="searchResults" class="search-results"></div>
        </div>

        <div id="tableOfContents" class="toc">
            <div class="toc-header" onclick="toggleToc()">
                <h3>📚 Table of Contents</h3>
                <button class="toc-toggle" id="tocToggle">▼</button>
            </div>
            <div class="toc-content" id="tocContent">
                <ul class="toc-list">
                <li><a href="#common-methods">Common Actions <span class="method-count">{len(common_methods)} methods</span></a></li>
"""

    # Add page object classes to TOC
    for class_name in sorted(methods_by_class.keys()):
        method_count = len(methods_by_class[class_name])
        anchor = class_name.lower()
        html_content += f'                <li><a href="#{anchor}">{class_name} <span class="method-count">{method_count} methods</span></a></li>\n'

    html_content += """                </ul>
            </div>
        </div>

        <div id="allMethods">
"""

    # Add Common Actions section
    if common_methods:
        html_content += f"""
        <div class="section" id="common-methods">
            <div class="section-header" onclick="toggleSection('common-methods')">
                <span>🔧 CommonActions ({len(common_methods)} methods)</span>
                <button class="section-toggle" id="toggle_common-methods">▼</button>
            </div>
            <div class="section-content" id="content_common-methods">
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

        for method in common_methods:
            # Parameters HTML for table
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
                                <div class="table-location">{method.location}</div>
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
            </div>
        </div>
"""

    # Add Page Object sections
    for class_name in sorted(methods_by_class.keys()):
        methods = methods_by_class[class_name]
        anchor = class_name.lower()

        html_content += f"""
        <div class="section" id="{anchor}">
            <div class="section-header" onclick="toggleSection('{anchor}')">
                <span>📄 {class_name} ({len(methods)} methods)</span>
                <button class="section-toggle" id="toggle_{anchor}">▼</button>
            </div>
            <div class="section-content" id="content_{anchor}">
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
            # Parameters HTML for table
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
                                <div class="table-location">{method.location}</div>
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
            </div>
        </div>
"""

    # JavaScript for search functionality
    html_content += f"""
        </div>
    </div>

    <script>
        // Method definitions data
        const methodDefinitions = {json.dumps(methods_json, indent=2)};

        // Search functionality
        const searchBox = document.getElementById('searchBox');
        const searchClear = document.getElementById('searchClear');
        const searchResults = document.getElementById('searchResults');
        const allMethods = document.getElementById('allMethods');
        const tableOfContents = document.getElementById('tableOfContents');

        let searchTimeout;

        searchBox.addEventListener('input', function() {{
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {{
                performSearch(this.value.trim());
                toggleClearButton();
            }}, 300);
        }});

        function toggleClearButton() {{
            if (searchBox.value.length > 0) {{
                searchClear.classList.add('visible');
            }} else {{
                searchClear.classList.remove('visible');
            }}
        }}

        function clearSearch() {{
            searchBox.value = '';
            searchClear.classList.remove('visible');
            showAllMethods();
            searchBox.focus();
        }}

        function performSearch(query) {{
            if (!query) {{
                showAllMethods();
                return;
            }}

            const results = searchMethods(query);
            displaySearchResults(results, query);
        }}

        function searchMethods(query) {{
            const queryLower = query.toLowerCase();
            const results = [];

            methodDefinitions.forEach(method => {{
                let score = 0;
                let matches = [];

                // Check method name match
                const methodNameLower = method.method_name.toLowerCase();
                if (methodNameLower.includes(queryLower)) {{
                    score += 100;
                    matches.push('method_name');
                }}

                // Check class name match
                const classNameLower = method.class_name.toLowerCase();
                if (classNameLower.includes(queryLower)) {{
                    score += 80;
                    matches.push('class_name');
                }}

                // Check purpose match
                const purposeLower = method.purpose.toLowerCase();
                if (purposeLower.includes(queryLower)) {{
                    score += 50;
                    matches.push('purpose');
                }}

                // Check parameters match
                method.parsed_params.forEach(param => {{
                    if (param.name.toLowerCase().includes(queryLower)) {{
                        score += 30;
                        matches.push('parameter');
                    }}
                }});

                // Check individual words for partial matching
                const queryWords = queryLower.split(/\\s+/);
                queryWords.forEach(word => {{
                    if (word.length > 2) {{
                        if (methodNameLower.includes(word)) score += 20;
                        if (classNameLower.includes(word)) score += 15;
                        if (purposeLower.includes(word)) score += 10;
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

            // Sort by score (highest first)
            results.sort((a, b) => b.score - a.score);

            return results;
        }}

        function displaySearchResults(results, query) {{
            allMethods.style.display = 'none';
            tableOfContents.style.display = 'none';

            if (results.length === 0) {{
                searchResults.innerHTML = `
                    <div class="search-stats">No results found for "${{query}}"</div>
                    <div class="no-results">
                        <p>🔍 No matching methods found.</p>
                        <p>Try searching for method names like "login", "verify", "click", or class names like "HomePage", "CartPage".</p>
                    </div>
                `;
                return;
            }}

            let html = `<div class="search-stats">Found ${{results.length}} matching method${{results.length !== 1 ? 's' : ''}} for "${{query}}"</div>`;

            html += `
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

            results.forEach(result => {{
                const method = result.method;

                // Parameters HTML for search results table
                let paramsHtml = "None";
                if (method.parsed_params && method.parsed_params.length > 0) {{
                    paramsHtml = "";
                    method.parsed_params.forEach(param => {{
                        paramsHtml += `<div class="table-param-item"><span class="table-param-type">${{param.name}}: ${{param.type}}</span> - ${{param.description}}</div>`;
                    }});
                }}

                // Highlight matches
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
                                    ${{highlightedClassName}} | ${{method.location}} | Score: ${{result.score}}
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

            searchResults.innerHTML = html;
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

        function showAllMethods() {{
            searchResults.innerHTML = '';
            allMethods.style.display = 'block';
            tableOfContents.style.display = 'block';
        }}

        // Toggle section
        function toggleSection(sectionId) {{
            const content = document.getElementById('content_' + sectionId);
            const toggle = document.getElementById('toggle_' + sectionId);

            if (content.classList.contains('collapsed')) {{
                content.classList.remove('collapsed');
                content.style.maxHeight = content.scrollHeight + 'px';
                toggle.textContent = '▼';
            }} else {{
                content.classList.add('collapsed');
                content.style.maxHeight = '0';
                toggle.textContent = '►';
            }}
        }}

        // Copy method signature function
        function copyMethodSignature(methodText, button) {{
            navigator.clipboard.writeText(methodText).then(function() {{
                // Visual feedback
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

        // Focus search box on page load
        window.addEventListener('load', function() {{
            searchBox.focus();

            // Initialize all sections as expanded
            const sections = document.querySelectorAll('[id^="content_"]');
            sections.forEach(section => {{
                section.style.maxHeight = section.scrollHeight + 'px';
            }});
        }});

        // Clear search with Escape key
        searchBox.addEventListener('keydown', function(e) {{
            if (e.key === 'Escape') {{
                this.value = '';
                showAllMethods();
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
    parser = argparse.ArgumentParser(description='Generate HTML Playwright methods documentation with search')
    parser.add_argument(
        '--output',
        '-o',
        default='PLAYWRIGHT_METHODS.html',
        help='Output HTML file (default: PLAYWRIGHT_METHODS.html)'
    )

    args = parser.parse_args()

    # Get absolute path
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    print(f"Scanning project: {project_root}")

    all_methods = []

    # Extract from CommonActionsHelpers.ts
    common_helpers_path = project_root / 'helpers' / 'CommonActionsHelpers.ts'
    if common_helpers_path.exists():
        relative_path = 'helpers/CommonActionsHelpers.ts'
        common_methods = extract_methods_from_common_helpers(common_helpers_path, relative_path)
        if common_methods:
            print(f"   FOUND: CommonActionsHelpers.ts: {len(common_methods)} methods")
            all_methods.extend(common_methods)
        else:
            print(f"   WARN: CommonActionsHelpers.ts: 0 methods")
    else:
        print(f"   WARN: CommonActionsHelpers.ts not found")

    # Extract from page-objects/*.ts files
    page_objects_dir = project_root / 'page-objects'
    if page_objects_dir.exists():
        ts_files = sorted(page_objects_dir.glob('*.ts'))

        for ts_file in ts_files:
            # Skip POManager.ts as it's just a factory
            if ts_file.name == 'POManager.ts':
                continue

            relative_path = f'page-objects/{ts_file.name}'
            page_methods = extract_methods_from_page_object(ts_file, relative_path)

            if page_methods:
                print(f"   FOUND: {ts_file.name}: {len(page_methods)} methods")
                all_methods.extend(page_methods)
            else:
                print(f"   WARN: {ts_file.name}: 0 methods")
    else:
        print(f"   ERROR: page-objects directory not found")

    if not all_methods:
        print("ERROR: No methods found")
        return 1

    # Generate HTML
    output_path = project_root / args.output
    generate_html(all_methods, output_path)

    print(f"\nGenerated: {output_path}")
    print(f"Total: {len(all_methods)} methods")

    # Count by type
    common_count = len([m for m in all_methods if m.method_type == "common"])
    page_object_count = len([m for m in all_methods if m.method_type == "page_object"])

    print(f"   - Common methods: {common_count}")
    print(f"   - Page object methods: {page_object_count}")
    print(f"\nHTML document includes:")
    print(f"   - Interactive search functionality")
    print(f"   - Method signatures with parameters")
    print(f"   - Usage examples for each method")
    print(f"   - Purpose descriptions")
    print(f"   - Copy-to-clipboard functionality")

    return 0


if __name__ == '__main__':
    exit(main())
