import os
import re
from pathlib import Path

# Base directory
base_dir = r"C:\Users\Amir\OneDrive - Digital Health CRC Limited\Projects\SynD\framework\SynD-DGF"

# Known issues and their categorization
broken_links_analysis = {}

# Patterns to detect
patterns = {
    'wrong_case': [],  # Links with case sensitivity issues
    'missing_files': [],  # Files that don't exist
    'wrong_path': [],  # Links using wrong relative path depth
    'absolute_paths': [],  # Links using absolute paths from root /
    'template_vars': [],  # Unprocessed template variables
    'legacy_paths': [],  # Links to old structure
    'missing_assets': [],  # Missing CSS/JS/images
}

def analyze_broken_link(file_path, link):
    """Analyze why a link is broken and categorize it"""

    # Template variables
    if '${' in link or '{%' in link:
        return 'template_vars', link, 'Unprocessed template variable - should be replaced with actual path'

    # Absolute paths from root
    if link.startswith('/') and not link.startswith('//'):
        # Check if it's trying to access decision-support, assessment-tools, etc.
        if link.startswith('/decision-support') or link.startswith('/assessment-tools') or link.startswith('/resources'):
            return 'absolute_paths', link, f'Should be relative: {link.lstrip("/")}'
        return 'absolute_paths', link, f'Should use relative path from {os.path.dirname(file_path)}'

    # Check for case sensitivity issues
    clean_link = link.split('?')[0].split('#')[0]
    if clean_link:
        current_dir = os.path.dirname(file_path)
        target_path = os.path.normpath(os.path.join(current_dir, clean_link))

        # Check if a similar file exists with different casing
        if os.path.exists(os.path.dirname(target_path)):
            dir_files = os.listdir(os.path.dirname(target_path))
            target_basename = os.path.basename(target_path)

            for existing_file in dir_files:
                if existing_file.lower() == target_basename.lower() and existing_file != target_basename:
                    return 'wrong_case', link, f'File exists as: {existing_file} (case mismatch)'

    # Check path depth issues (too many ../)
    if '../' in link:
        depth = link.count('../')
        file_depth = file_path.replace(base_dir, '').count(os.sep) - 1

        if depth != file_depth:
            return 'wrong_path', link, f'Path depth mismatch: uses {depth} ../ but file is {file_depth} levels deep'

    # Missing asset files
    if any(link.endswith(ext) for ext in ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.pdf']):
        return 'missing_assets', link, 'Asset file does not exist at specified path'

    # Legacy path references
    if 'web-pages' in link or 'web-templates' in link:
        return 'legacy_paths', link, 'References legacy _legacy/ structure'

    # Default: missing file
    return 'missing_files', link, 'Target file does not exist'

# Re-run analysis with categorization
html_files = []
for root, dirs, files in os.walk(base_dir):
    if '_legacy' in root or 'temp' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

href_pattern = re.compile(r'href=["\']([^"\']+)["\']', re.IGNORECASE)
src_pattern = re.compile(r'src=["\']([^"\']+)["\']', re.IGNORECASE)

for html_file in html_files:
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        href_links = href_pattern.findall(content)
        src_links = src_pattern.findall(content)
        all_links = set(href_links + src_links)

        for link in all_links:
            # Skip external URLs
            if link.startswith(('http://', 'https://', 'mailto:', 'tel:', '#', 'javascript:')):
                continue

            clean_link = link.split('?')[0].split('#')[0]
            if not clean_link:
                continue

            # Check if file exists
            current_dir = os.path.dirname(html_file)
            if link.startswith('/'):
                target_path = os.path.normpath(os.path.join(base_dir, link.lstrip('/')))
            else:
                target_path = os.path.normpath(os.path.join(current_dir, clean_link))

            if not os.path.exists(target_path):
                rel_html_file = os.path.relpath(html_file, base_dir)
                category, broken_link, suggestion = analyze_broken_link(html_file, link)

                if category not in broken_links_analysis:
                    broken_links_analysis[category] = []

                broken_links_analysis[category].append({
                    'file': rel_html_file,
                    'link': broken_link,
                    'suggestion': suggestion
                })

    except Exception as e:
        print(f"Error processing {html_file}: {e}")

# Print categorized report
print("\n" + "="*100)
print("DETAILED BROKEN LINKS ANALYSIS - CATEGORIZED BY ISSUE TYPE")
print("="*100 + "\n")

category_names = {
    'template_vars': 'UNPROCESSED TEMPLATE VARIABLES',
    'absolute_paths': 'ABSOLUTE PATHS (should be relative)',
    'wrong_case': 'CASE SENSITIVITY ISSUES',
    'wrong_path': 'INCORRECT PATH DEPTH',
    'legacy_paths': 'LEGACY PATH REFERENCES',
    'missing_assets': 'MISSING ASSET FILES',
    'missing_files': 'MISSING HTML FILES',
}

total_issues = 0
for category in ['template_vars', 'absolute_paths', 'wrong_case', 'wrong_path', 'legacy_paths', 'missing_assets', 'missing_files']:
    if category in broken_links_analysis and broken_links_analysis[category]:
        issues = broken_links_analysis[category]
        total_issues += len(issues)

        print(f"\n{category_names[category]}")
        print("-" * 100)
        print(f"Total issues: {len(issues)}\n")

        # Group by file
        by_file = {}
        for issue in issues:
            if issue['file'] not in by_file:
                by_file[issue['file']] = []
            by_file[issue['file']].append(issue)

        for file_path in sorted(by_file.keys()):
            print(f"\n  File: {file_path}")
            for issue in by_file[file_path]:
                print(f"    Broken: {issue['link']}")
                print(f"    Fix: {issue['suggestion']}")
                print()

print("\n" + "="*100)
print(f"SUMMARY: {total_issues} total broken links across {len(html_files)} HTML files")
print("="*100)
