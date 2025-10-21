#!/usr/bin/env python3
"""
Verify emoji removal and generate detailed report
"""

import os
import re
from pathlib import Path
from collections import defaultdict

# Define the base directory
BASE_DIR = r"C:\Users\Amir\OneDrive - Digital Health CRC Limited\Projects\SynD\framework\SynD-DGF"

# Emojis to keep
KEEP_EMOJIS = {'⚠️', '⚠', '✗', '✓'}

# Comprehensive emoji pattern
EMOJI_PATTERN = re.compile(
    "["
    "\U0001F300-\U0001F9FF"
    "\U0001F600-\U0001F64F"
    "\U0001F680-\U0001F6FF"
    "\U00002600-\U000027BF"
    "\U0001F1E0-\U0001F1FF"
    "\U00002700-\U000027BF"
    "\U0001F900-\U0001F9FF"
    "\U0001FA00-\U0001FA6F"
    "\U00002B50"
    "\U00002194-\U00002199"
    "\U000021A9-\U000021AA"
    "\U00002328\U000023CF"
    "\U000023E9-\U000023F3"
    "\U000023F8-\U000023FA"
    "\U000024C2"
    "\U000025AA-\U000025AB"
    "\U000025B6\U000025C0"
    "\U000025FB-\U000025FE"
    "\U00002600-\U00002604"
    "\U0000260E\U00002611"
    "\U00002614-\U00002615"
    "\U00002618\U0000261D"
    "\U00002620"
    "\U00002622-\U00002623"
    "\U00002626\U0000262A"
    "\U0000262E-\U0000262F"
    "\U00002638-\U0000263A"
    "\U00002640\U00002642"
    "\U00002648-\U00002653"
    "\U00002660\U00002663"
    "\U00002665-\U00002666"
    "\U00002668\U0000267B"
    "\U0000267E-\U0000267F"
    "\U00002692-\U00002697"
    "\U00002699"
    "\U0000269B-\U0000269C"
    "\U000026A0-\U000026A1"
    "\U000026AA-\U000026AB"
    "\U000026B0-\U000026B1"
    "\U000026BD-\U000026BE"
    "\U000026C4-\U000026C5"
    "\U000026C8\U000026CE"
    "\U000026CF\U000026D1"
    "\U000026D3-\U000026D4"
    "\U000026E9-\U000026EA"
    "\U000026F0-\U000026F5"
    "\U000026F7-\U000026FA"
    "\U000026FD\U00002702"
    "\U00002705"
    "\U00002708-\U0000270D"
    "\U0000270F\U00002712"
    "\U00002714\U00002716"
    "\U0000271D\U00002721"
    "\U00002728"
    "\U00002733-\U00002734"
    "\U00002744\U00002747"
    "\U0000274C\U0000274E"
    "\U00002753-\U00002755"
    "\U00002757"
    "\U00002763-\U00002764"
    "\U00002795-\U00002797"
    "\U000027A1\U000027B0"
    "\U000027BF"
    "\U00002934-\U00002935"
    "\U00002B05-\U00002B07"
    "\U00002B1B-\U00002B1C"
    "\U00002B55\U00003030"
    "\U0000303D\U00003297"
    "\U00003299"
    "]"
)

def find_emojis_in_file(filepath):
    """Find all emojis in a file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        emojis_found = defaultdict(int)
        for char in content:
            if EMOJI_PATTERN.match(char):
                emojis_found[char] += 1

        return emojis_found
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return {}

def main():
    """Main function to verify emoji removal"""
    stats = {
        'files_scanned': 0,
        'files_with_emojis': 0,
        'total_emojis_found': 0,
        'emojis_by_file': [],
        'emoji_summary': defaultdict(int)
    }

    # Find all HTML files (excluding _legacy directory)
    html_files = []
    for root, dirs, files in os.walk(BASE_DIR):
        if '_legacy' in root or 'temp' in root:
            continue

        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))

    # Process each file
    for filepath in html_files:
        stats['files_scanned'] += 1
        emojis = find_emojis_in_file(filepath)

        if emojis:
            stats['files_with_emojis'] += 1
            total_in_file = sum(emojis.values())
            stats['total_emojis_found'] += total_in_file

            rel_path = os.path.relpath(filepath, BASE_DIR)
            stats['emojis_by_file'].append({
                'file': rel_path,
                'emojis': dict(emojis),
                'total': total_in_file
            })

            for emoji, count in emojis.items():
                stats['emoji_summary'][emoji] += count

    # Print report (console-safe version)
    print("\n" + "="*80)
    print("EMOJI VERIFICATION REPORT")
    print("="*80)
    print(f"\nTotal files scanned: {stats['files_scanned']}")
    print(f"Files with emojis: {stats['files_with_emojis']}")
    print(f"Total emoji occurrences: {stats['total_emojis_found']}")

    if stats['emoji_summary']:
        print("\n" + "-"*80)
        print("EMOJIS FOUND (summary):")
        print("-"*80)
        for emoji, count in sorted(stats['emoji_summary'].items(), key=lambda x: x[1], reverse=True):
            emoji_name = "WARNING" if emoji in ('⚠️', '⚠') else ("X_MARK" if emoji == '✗' else ("CHECK" if emoji == '✓' else "UNKNOWN"))
            in_keep_list = "[ALLOWED]" if emoji in KEEP_EMOJIS else "[SHOULD BE REMOVED]"
            print(f"  {emoji_name}: {count} occurrences - {in_keep_list}")

    if stats['emojis_by_file']:
        print("\n" + "-"*80)
        print("EMOJIS BY FILE:")
        print("-"*80)
        for detail in sorted(stats['emojis_by_file'], key=lambda x: x['total'], reverse=True):
            print(f"\n  {detail['file']} ({detail['total']} total)")

    print("\n" + "="*80)

    # Save report to file
    report_path = os.path.join(BASE_DIR, 'temp', 'emoji_report.txt')
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("="*80 + "\n")
        f.write("EMOJI VERIFICATION REPORT\n")
        f.write("="*80 + "\n\n")
        f.write(f"Total files scanned: {stats['files_scanned']}\n")
        f.write(f"Files with emojis: {stats['files_with_emojis']}\n")
        f.write(f"Total emoji occurrences: {stats['total_emojis_found']}\n\n")

        if stats['emoji_summary']:
            f.write("-"*80 + "\n")
            f.write("EMOJIS FOUND (summary):\n")
            f.write("-"*80 + "\n")
            for emoji, count in sorted(stats['emoji_summary'].items(), key=lambda x: x[1], reverse=True):
                emoji_name = "WARNING" if emoji in ('⚠️', '⚠') else ("X_MARK" if emoji == '✗' else ("CHECK" if emoji == '✓' else "UNKNOWN"))
                in_keep_list = "ALLOWED" if emoji in KEEP_EMOJIS else "SHOULD BE REMOVED"
                f.write(f"{emoji} ({emoji_name}): {count} occurrences - {in_keep_list}\n")

        if stats['emojis_by_file']:
            f.write("\n" + "-"*80 + "\n")
            f.write("EMOJIS BY FILE:\n")
            f.write("-"*80 + "\n")
            for detail in sorted(stats['emojis_by_file'], key=lambda x: x['total'], reverse=True):
                f.write(f"\n{detail['file']} ({detail['total']} total):\n")
                for emoji, count in detail['emojis'].items():
                    f.write(f"  {emoji}: {count}\n")

        f.write("\n" + "="*80 + "\n")

    print(f"\nDetailed report saved to: {report_path}")

if __name__ == "__main__":
    main()
