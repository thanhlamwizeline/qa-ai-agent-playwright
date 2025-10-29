#!/usr/bin/env python3
"""
Generate HTML version of step definitions with search functionality.

Usage:
    python scripts/extract_step_definitions.py
    python scripts/extract_step_definitions.py --dir features/step_definitions
    python scripts/extract_step_definitions.py --output STEP_DEFINITIONS.html
"""

import os
import re
from pathlib import Path
from datetime import datetime, timezone
import argparse
from typing import List, Dict, Tuple
import json


class StepDefinition:
    """Represents a step definition with enhanced metadata."""

    def __init__(self, gherkin_type: str, pattern: str, location: str):
        self.type = gherkin_type
        self.pattern = pattern
        self.location = location
        self.parameters = self._extract_parameters()
        self.purpose = self._infer_purpose()
        self.example = self._generate_example()

    def _extract_parameters(self) -> List[Dict[str, str]]:
        """Extract and describe parameters from the pattern."""
        params = []

        # Find all {string}, {int}, etc.
        pattern_lower = self.pattern.lower()
        param_matches = list(re.finditer(r'\{(string|int|float)\}', self.pattern))

        for idx, match in enumerate(param_matches):
            param_type = match.group(1)

            # Infer parameter description based on context
            description = self._infer_param_description(param_type, idx, pattern_lower)

            params.append({
                'type': f'{{{param_type}}}',
                'description': description
            })

        return params

    def _infer_param_description(self, param_type: str, index: int, pattern_lower: str) -> str:
        """Infer parameter description from context."""
        # Username/Password
        if 'username' in pattern_lower and index == 0:
            return 'Username to login'
        if 'password' in pattern_lower:
            return 'Password to login'

        # XPath
        if 'xpath' in pattern_lower:
            if index == 0:
                return 'XPath locator of the element'
            else:
                return 'Text/value to verify or input'

        # Product info
        if 'product' in pattern_lower:
            if 'name' in pattern_lower and index == 0:
                return 'Product name'
            if 'price' in pattern_lower:
                return 'Product price (e.g., "$10.00")'

        # Category
        if 'category' in pattern_lower:
            return 'Category name'

        # Message/Text
        if 'message' in pattern_lower or 'text' in pattern_lower:
            return 'Expected message/text to verify'

        # Wait time
        if 'wait' in pattern_lower or 'second' in pattern_lower:
            return 'Number of seconds to wait'

        # Generic
        if param_type == 'string':
            return 'String value'
        elif param_type == 'int':
            return 'Integer number'
        else:
            return 'Value'

    def _infer_purpose(self) -> str:
        """Infer the purpose of this step."""
        pattern_lower = self.pattern.lower()

        # Navigation
        if 'navigate' in pattern_lower or 'redirected' in pattern_lower:
            return 'Navigate to or verify page navigation'
        if 'go to' in pattern_lower:
            return 'Navigate to a specific page or section'

        # Login
        if 'login' in pattern_lower:
            if 'failed' in pattern_lower or 'error' in pattern_lower or 'message' in pattern_lower:
                return 'Verify login error/failure message'
            else:
                return 'Perform login action with credentials'

        # Click actions
        if 'click' in pattern_lower:
            if 'product' in pattern_lower:
                return 'Click on a product to view details'
            elif 'category' in pattern_lower:
                return 'Filter products by category'
            elif 'cart' in pattern_lower or 'add' in pattern_lower:
                return 'Add product to shopping cart'
            else:
                return 'Click on an element'

        # Input actions
        if 'type' in pattern_lower or 'fill' in pattern_lower:
            return 'Enter text into an input field'
        if 'clear' in pattern_lower:
            return 'Clear the content of an input field'

        # Verification (Then steps)
        if self.type == 'Then' or 'see' in pattern_lower or 'verify' in pattern_lower:
            if 'visible' in pattern_lower:
                if 'not' in pattern_lower:
                    return 'Verify element is NOT visible on page'
                else:
                    return 'Verify element is visible on page'
            elif 'enabled' in pattern_lower:
                return 'Verify element is enabled/clickable'
            elif 'disabled' in pattern_lower:
                return 'Verify element is disabled/not clickable'
            elif 'contains' in pattern_lower:
                return 'Verify element contains expected text or value'
            elif 'cart' in pattern_lower and 'product' in pattern_lower:
                return 'Verify product exists in shopping cart'
            elif 'product' in pattern_lower and 'detail' in pattern_lower:
                return 'Verify product information on detail page'
            elif 'username' in pattern_lower:
                return 'Verify logged-in username is displayed'
            else:
                return 'Verify expected condition or state'

        # Wait
        if 'wait' in pattern_lower:
            return 'Pause test execution for specified duration'

        # Cart operations
        if 'cart' in pattern_lower and 'clear' in pattern_lower:
            return 'Remove all items from cart and return home'

        return 'Perform test step action'

    def _generate_example(self) -> str:
        """Generate usage example for this step."""
        pattern_lower = self.pattern.lower()
        example = f"{self.type} {self.pattern}"

        # Replace placeholders with realistic examples
        if 'username' in pattern_lower and 'password' in pattern_lower:
            example = example.replace('{string}', '"test_user"', 1)
            example = example.replace('{string}', '"password123"', 1)
        elif 'xpath' in pattern_lower:
            if 'type' in pattern_lower or 'fill' in pattern_lower:
                example = example.replace('{string}', '"Hello World"', 1)
                example = example.replace('{string}', '"//input[@id=\'search\']"', 1)
            elif 'text' in pattern_lower:
                example = example.replace('{string}', '"Welcome"', 1)
                example = example.replace('{string}', '"//h1[@class=\'title\']"', 1)
            else:
                example = example.replace('{string}', '"//button[@id=\'submit\']"')
        elif 'product' in pattern_lower:
            example = example.replace('{string}', '"Samsung galaxy s6"', 1)
            if 'price' in pattern_lower:
                example = example.replace('{string}', '"$360"')
        elif 'category' in pattern_lower:
            example = example.replace('{string}', '"Phones"')
        elif 'message' in pattern_lower:
            example = example.replace('{string}', '"Wrong password."')
        elif 'wait' in pattern_lower:
            example = example.replace('{int}', '3')
        else:
            # Generic string replacement
            count = 0
            while '{string}' in example:
                count += 1
                example = example.replace('{string}', f'"example{count}"', 1)
            example = example.replace('{int}', '5')

        return example

    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON serialization."""
        return {
            'type': self.type,
            'pattern': self.pattern,
            'location': self.location,
            'parameters': self.parameters,
            'purpose': self.purpose,
            'example': self.example
        }


def extract_steps_from_file(file_path: Path, relative_path: str) -> List[StepDefinition]:
    """Extract step patterns from a TypeScript file."""
    steps = []

    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Pattern to match Given, When, Then statements
    step_pattern = re.compile(r'^(Given|When|Then)\s*\(\s*[\'"](.+?)[\'"]\s*,')

    for line_num, line in enumerate(lines, start=1):
        match = step_pattern.match(line.strip())
        if match:
            gherkin_type = match.group(1)
            pattern = match.group(2)
            location = f'{relative_path}:{line_num}'

            step = StepDefinition(gherkin_type, pattern, location)
            steps.append(step)

    return steps


def generate_html(all_steps: List[StepDefinition], output_file: str = 'STEP_DEFINITIONS.html'):
    """Generate HTML documentation with search functionality."""
    
    # Group by file
    steps_by_file = {}
    for step in all_steps:
        file_name = step.location.split(':')[0].split('/')[-1]
        if file_name not in steps_by_file:
            steps_by_file[file_name] = []
        steps_by_file[file_name].append(step)

    # Sort files: CommonSteps should be last
    def sort_key(filename):
        if filename == 'CommonSteps.ts':
            return 'zzz'  # Put at the end
        return filename

    sorted_files = sorted(steps_by_file.keys(), key=sort_key)

    # Convert steps to JSON for JavaScript
    steps_json = []
    for step in all_steps:
        steps_json.append(step.to_dict())

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QA AI Agent - Step Definitions Reference</title>
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

        .file-section {{
            background: white;
            border-radius: 12px;
            margin-bottom: 30px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}

        .file-header {{
            background: #f8f9fa;
            padding: 20px 30px;
            border-bottom: 1px solid #e9ecef;
        }}

        .file-title {{
            font-size: 1.5rem;
            font-weight: 600;
            color: #495057;
            margin: 0;
        }}

        .file-stats {{
            font-size: 14px;
            color: #6c757d;
            margin-top: 5px;
        }}

        .step-item {{
            padding: 25px 30px;
            border-bottom: 1px solid #f1f3f4;
            transition: background-color 0.2s ease;
        }}

        .step-item:last-child {{
            border-bottom: none;
        }}

        .step-item:hover {{
            background-color: #f8f9fa;
        }}

        .step-pattern {{
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

        .step-type {{
            color: #4ade80;
            font-weight: bold;
        }}

        .step-details {{
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

        .param-type {{
            font-family: monospace;
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 3px;
            font-weight: bold;
            color: #495057;
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

        .toc-header h2 {{
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
            margin-bottom: 10px;
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

        .step-count {{
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

        .table-example {{
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 12px;
            background: #f8f9fa;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #e9ecef;
            white-space: pre-wrap;
            word-wrap: break-word;
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

        .table-location {{
            font-family: monospace;
            font-size: 11px;
            color: #667eea;
        }}

        .file-section-header {{
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

        .file-section-header:hover {{
            background: #5a6fd8;
        }}

        .file-toggle {{
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
        }}

        .file-toggle:hover {{
            background: rgba(255,255,255,0.2);
        }}

        .file-content {{
            overflow: hidden;
            transition: max-height 0.3s ease;
        }}

        .file-content.collapsed {{
            max-height: 0;
        }}

        .highlight {{
            background-color: #ff6b6b;
            color: white;
            padding: 2px 4px;
            border-radius: 3px;
            font-weight: bold;
        }}

        @media (max-width: 768px) {{
            .container {{
                padding: 10px;
            }}

            .header h1 {{
                font-size: 2rem;
            }}

            .step-details {{
                grid-template-columns: 1fr;
            }}

            .search-container, .file-section, .toc {{
                padding: 20px;
            }}

            .step-item {{
                padding: 20px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Available Steps Reference for AI Test Case Generation</h1>
            <p>Total Steps: {len(all_steps)} <span style="font-size: 0.8em;">(Last generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')} - UTC)</span></p>
        </div>

        <div class="search-container">
            <div class="search-wrapper">
                <input type="text" id="searchBox" class="search-box" placeholder="Search step definitions... (e.g., 'I navigate to', 'click product', 'login with')" autocomplete="off">
                <button id="searchClear" class="search-clear" onclick="clearSearch()">✕</button>
            </div>
            <div class="search-help">
                💡 <strong>Search tips:</strong> Type partial step text to find similar steps. Try "navigate", "click", "login", "cart", etc.
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
"""

    # Add table of contents
    for file_name in sorted_files:
        anchor = file_name.lower().replace('.', '')
        step_count = len(steps_by_file[file_name])
        html_content += f'                <li><a href="#{anchor}">{file_name} <span class="step-count">{step_count} steps</span></a></li>\n'

    html_content += """                </ul>
            </div>
        </div>

        <div id="allSteps">
"""

    # Generate content for each file as tables
    for file_name in sorted_files:
        anchor = file_name.lower().replace('.', '')
        html_content += f"""
        <div class="file-section" id="{anchor}">
            <div class="file-section-header" onclick="toggleFileSection('{anchor}')">
                <span>📁 {file_name} ({len(steps_by_file[file_name])} steps)</span>
                <button class="file-toggle" id="fileToggle_{anchor}">▼</button>
            </div>
            <div class="file-content" id="fileContent_{anchor}">
                <div class="table-wrapper">
                    <table class="steps-table">
                <thead>
                    <tr>
                        <th style="width: 50%; text-align: left;">Step Pattern</th>
                        <th style="width: 15%;">Parameters</th>
                        <th style="width: 13%;">Purpose</th>
                        <th style="width: 22%;">Example</th>
                    </tr>
                </thead>
                <tbody>
"""

        for step in steps_by_file[file_name]:
            # Parameters HTML for table
            params_html = "None"
            if step.parameters:
                params_html = ""
                for param in step.parameters:
                    params_html += f'<div class="table-param-item"><span class="table-param-type">{param["type"]}</span> - {param["description"]}</div>'

            html_content += f"""
                    <tr>
                        <td>
                            <div class="table-step-pattern">
                                <div class="step-text scrollable">
                                    <span class="table-step-type">{step.type}</span> {step.pattern}
                                </div>
                                <button class="copy-btn" onclick="copyStepPattern('{step.type} {step.pattern}', this)">
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
                            <div class="table-purpose">{step.purpose}</div>
                        </td>
                        <td>
                            <div class="table-example">{step.example}</div>
                        </td>
                    </tr>
"""

        html_content += """                </tbody>
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
        // Step definitions data
        const stepDefinitions = {json.dumps(steps_json, indent=2)};
        
        // Search functionality
        const searchBox = document.getElementById('searchBox');
        const searchClear = document.getElementById('searchClear');
        const searchResults = document.getElementById('searchResults');
        const allSteps = document.getElementById('allSteps');
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
            showAllSteps();
            searchBox.focus();
        }}
        
        function performSearch(query) {{
            if (!query) {{
                showAllSteps();
                return;
            }}
            
            const results = searchSteps(query);
            displaySearchResults(results, query);
        }}
        
        function searchSteps(query) {{
            const queryLower = query.toLowerCase();
            const results = [];
            
            stepDefinitions.forEach(step => {{
                let score = 0;
                let matches = [];
                
                // Check pattern match
                const patternLower = step.pattern.toLowerCase();
                if (patternLower.includes(queryLower)) {{
                    score += 100;
                    matches.push('pattern');
                }}
                
                // Check purpose match
                const purposeLower = step.purpose.toLowerCase();
                if (purposeLower.includes(queryLower)) {{
                    score += 50;
                    matches.push('purpose');
                }}
                
                // Check example match (but don't add to score)
                const exampleLower = step.example.toLowerCase();
                if (exampleLower.includes(queryLower)) {{
                    matches.push('example');
                }}
                
                // Check individual words for partial matching
                const queryWords = queryLower.split(/\\s+/);
                queryWords.forEach(word => {{
                    if (word.length > 2) {{
                        if (patternLower.includes(word)) score += 20;
                        if (purposeLower.includes(word)) score += 10;
                    }}
                }});
                
                if (score > 0) {{
                    results.push({{
                        step: step,
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
            allSteps.style.display = 'none';
            tableOfContents.style.display = 'none';
            
            if (results.length === 0) {{
                searchResults.innerHTML = `
                    <div class="search-stats">No results found for "${{query}}"</div>
                    <div class="no-results">
                        <p>🔍 No matching step definitions found.</p>
                        <p>Try searching for keywords like "navigate", "click", "login", "cart", or "verify".</p>
                    </div>
                `;
                return;
            }}
            
            let html = `<div class="search-stats">Found ${{results.length}} matching step${{results.length !== 1 ? 's' : ''}} for "${{query}}"</div>`;
            
            html += `
                <table class="steps-table">
                    <thead>
                        <tr>
                            <th style="width: 50%; text-align: left;">Step Pattern</th>
                            <th style="width: 15%;">Parameters</th>
                            <th style="width: 13%;">Purpose</th>
                            <th style="width: 22%;">Example</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            results.forEach(result => {{
                const step = result.step;
                const fileName = step.location.split(':')[0].split('/').pop();
                
                // Parameters HTML for search results table
                let paramsHtml = "None";
                if (step.parameters && step.parameters.length > 0) {{
                    paramsHtml = "";
                    step.parameters.forEach(param => {{
                        paramsHtml += `<div class="table-param-item"><span class="table-param-type">${{param.type}}</span> - ${{param.description}}</div>`;
                    }});
                }}
                
                // Highlight matches
                const highlightedPattern = highlightMatch(step.pattern, query);
                const highlightedPurpose = highlightMatch(step.purpose, query);
                const highlightedExample = highlightMatch(step.example, query);
                
                html += `
                        <tr>
                            <td>
                                <div class="table-step-pattern">
                                    <div class="step-text">
                                        <span class="table-step-type">${{step.type}}</span> ${{highlightedPattern}}
                                    </div>
                                    <button class="copy-btn" onclick="copyStepPattern('${{step.type}} ${{step.pattern}}', this)">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                                        </svg>
                                    </button>
                                </div>
                                <div style="font-size: 11px; color: #6c757d; margin-top: 4px;">${{step.location}} (Score: ${{result.score}})</div>
                            </td>
                            <td>
                                <div class="table-parameters">${{paramsHtml}}</div>
                            </td>
                            <td>
                                <div class="table-purpose">${{highlightedPurpose}}</div>
                            </td>
                            <td>
                                <div class="table-example">${{highlightedExample}}</div>
                            </td>
                        </tr>
                `;
            }});
            
            html += `
                    </tbody>
                </table>
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
        
        function showAllSteps() {{
            searchResults.innerHTML = '';
            allSteps.style.display = 'block';
            tableOfContents.style.display = 'block';
        }}
        
        // Focus search box on page load
        window.addEventListener('load', function() {{
            searchBox.focus();
        }});
        
        // Clear search with Escape key
        searchBox.addEventListener('keydown', function(e) {{
            if (e.key === 'Escape') {{
                this.value = '';
                showAllSteps();
            }}
        }});
        
        // Toggle table of contents
        function toggleToc() {{
            const tocContent = document.getElementById('tocContent');
            const tocToggle = document.getElementById('tocToggle');
            
            if (tocContent.classList.contains('collapsed')) {{
                tocContent.classList.remove('collapsed');
                tocContent.style.maxHeight = tocContent.scrollHeight + 'px';
                tocToggle.textContent = '▼';
            }} else {{
                tocContent.classList.add('collapsed');
                tocContent.style.maxHeight = '0';
                tocToggle.textContent = '►';
            }}
        }}
        
        // Toggle file section
        function toggleFileSection(sectionId) {{
            const fileContent = document.getElementById('fileContent_' + sectionId);
            const fileToggle = document.getElementById('fileToggle_' + sectionId);
            
            if (fileContent.classList.contains('collapsed')) {{
                fileContent.classList.remove('collapsed');
                fileContent.style.maxHeight = fileContent.scrollHeight + 'px';
                fileToggle.textContent = '▼';
            }} else {{
                fileContent.classList.add('collapsed');
                fileContent.style.maxHeight = '0';
                fileToggle.textContent = '►';
            }}
        }}
        
        // Copy step pattern function
        function copyStepPattern(stepText, button) {{
            navigator.clipboard.writeText(stepText).then(function() {{
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
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = stepText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Visual feedback
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('copied');
                
                setTimeout(function() {{
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }}, 1500);
            }});
        }}
        
        // Initialize TOC as expanded and file sections as expanded by default
        window.addEventListener('load', function() {{
            const tocContent = document.getElementById('tocContent');
            // Start TOC expanded
            tocContent.style.maxHeight = tocContent.scrollHeight + 'px';
            document.getElementById('tocToggle').textContent = '▼';
            
            // Initialize all file sections as expanded
            const fileSections = document.querySelectorAll('[id^="fileContent_"]');
            fileSections.forEach(section => {{
                section.style.maxHeight = section.scrollHeight + 'px';
            }});
        }});
    </script>
</body>
</html>"""

    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)

    return output_file


def main():
    parser = argparse.ArgumentParser(description='Generate HTML step definitions documentation with search')
    parser.add_argument(
        '--dir',
        '-d',
        default='features/step_definitions',
        help='Directory containing step definition files (default: features/step_definitions)'
    )
    parser.add_argument(
        '--output',
        '-o',
        default='STEP_DEFINITIONS.html',
        help='Output HTML file (default: STEP_DEFINITIONS.html)'
    )

    args = parser.parse_args()

    # Get absolute path
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    step_def_dir = project_root / args.dir

    if not step_def_dir.exists():
        print(f"ERROR: Directory not found: {step_def_dir}")
        return 1

    print(f"Scanning directory: {step_def_dir}")

    # Find all *Steps.ts files
    all_steps = []
    ts_files = sorted(step_def_dir.glob('*Steps.ts')) + sorted(step_def_dir.glob('*Step.ts'))

    if not ts_files:
        print(f"ERROR: No *Steps.ts or *Step.ts files found in {step_def_dir}")
        return 1

    for ts_file in ts_files:
        relative_path = f"{args.dir}/{ts_file.name}"
        steps = extract_steps_from_file(ts_file, relative_path)

        if steps:
            print(f"   FOUND: {ts_file.name}: {len(steps)} steps")
            all_steps.extend(steps)
        else:
            print(f"   WARN: {ts_file.name}: 0 steps")

    if not all_steps:
        print("ERROR: No step definitions found")
        return 1

    # Generate HTML
    output_path = project_root / args.output
    generate_html(all_steps, output_path)

    print(f"\nGenerated: {output_path}")
    print(f"Total: {len(all_steps)} steps from {len(ts_files)} files")
    print(f"\nHTML document includes:")
    print(f"   - Interactive search functionality")
    print(f"   - Responsive design with modern styling")
    print(f"   - Parameter descriptions and examples")
    print(f"   - Purpose explanations for each step")
    print(f"   - Fuzzy search with score-based ranking")

    return 0


if __name__ == '__main__':
    exit(main())