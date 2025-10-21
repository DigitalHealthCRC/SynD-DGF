import os
import re
from pathlib import Path
from urllib.parse import urljoin, urlparse

# Base directory
base_dir = r"C:\Users\Amir\OneDrive - Digital Health CRC Limited\Projects\SynD\framework\SynD-DGF"

# Find all HTML files (excluding _legacy)
html_files = []
for root, dirs, files in os.walk(base_dir):
    # Skip _legacy directory
    if '_legacy' in root or 'temp' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

print(f"Found {len(html_files)} HTML files to check\n")

# Storage for broken links
broken_links = []

# Regex patterns for finding links
href_pattern = re.compile(r'href=["\']([^"\']+)["\']', re.IGNORECASE)
src_pattern = re.compile(r'src=["\']([^"\']+)["\']', re.IGNORECASE)

def is_external_url(url):
    """Check if URL is external (http/https/mailto/etc)"""
    return url.startswith(('http://', 'https://', 'mailto:', 'tel:', '#', 'javascript:'))

def resolve_path(current_file, link):
    """Resolve relative path to absolute path"""
    current_dir = os.path.dirname(current_file)

    # Handle absolute paths from root (/)
    if link.startswith('/'):
        return os.path.normpath(os.path.join(base_dir, link.lstrip('/')))

    # Handle relative paths
    return os.path.normpath(os.path.join(current_dir, link))

def check_file_exists(file_path, link):
    """Check if target file exists"""
    # Remove query strings and anchors
    clean_link = link.split('?')[0].split('#')[0]

    if not clean_link or is_external_url(clean_link):
        return True  # Skip external URLs

    target_path = resolve_path(file_path, clean_link)

    # Check if file exists
    return os.path.exists(target_path)

# Check each HTML file
for html_file in sorted(html_files):
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find all href links
        href_links = href_pattern.findall(content)
        src_links = src_pattern.findall(content)

        all_links = set(href_links + src_links)

        for link in all_links:
            # Skip external URLs, anchors, and special URLs
            if is_external_url(link):
                continue

            # Remove query strings and anchors
            clean_link = link.split('?')[0].split('#')[0]

            if not clean_link:
                continue

            # Check if file exists
            if not check_file_exists(html_file, clean_link):
                rel_html_file = os.path.relpath(html_file, base_dir)
                broken_links.append({
                    'file': rel_html_file,
                    'link': link,
                    'type': 'CSS' if link.endswith('.css') else
                            'JS' if link.endswith('.js') else
                            'Image' if any(link.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico']) else
                            'HTML'
                })

    except Exception as e:
        print(f"Error processing {html_file}: {e}")

# Print results organized by file
print("\n" + "="*80)
print("BROKEN LINKS REPORT")
print("="*80 + "\n")

if not broken_links:
    print("No broken links found!")
else:
    # Group by file
    by_file = {}
    for item in broken_links:
        if item['file'] not in by_file:
            by_file[item['file']] = []
        by_file[item['file']].append(item)

    # Print by file
    for file_path in sorted(by_file.keys()):
        print(f"\n{file_path}")
        print("-" * 80)

        # Group by type
        by_type = {}
        for item in by_file[file_path]:
            link_type = item['type']
            if link_type not in by_type:
                by_type[link_type] = []
            by_type[link_type].append(item['link'])

        for link_type in sorted(by_type.keys()):
            print(f"\n  {link_type} Links:")
            for link in sorted(set(by_type[link_type])):
                print(f"    - {link}")

print(f"\n\nTotal broken links: {len(broken_links)}")
print(f"Files with broken links: {len(by_file)}")
