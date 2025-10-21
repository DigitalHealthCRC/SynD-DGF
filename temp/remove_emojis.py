#!/usr/bin/env python3
"""
Remove all emojis from HTML files except ⚠️, ✗, and ✓
"""

import os
import re
from pathlib import Path

# Define the base directory
BASE_DIR = r"C:\Users\Amir\OneDrive - Digital Health CRC Limited\Projects\SynD\framework\SynD-DGF"

# Emojis to keep
KEEP_EMOJIS = {'⚠️', '⚠', '✗', '✓'}

# Comprehensive emoji pattern (matches most emojis)
EMOJI_PATTERN = re.compile(
    "["
    "\U0001F300-\U0001F9FF"  # Miscellaneous Symbols and Pictographs + Supplemental Symbols and Pictographs
    "\U0001F600-\U0001F64F"  # Emoticons
    "\U0001F680-\U0001F6FF"  # Transport and Map Symbols
    "\U00002600-\U000027BF"  # Miscellaneous Symbols + Dingbats (but we'll preserve specific ones)
    "\U0001F1E0-\U0001F1FF"  # Flags
    "\U00002700-\U000027BF"  # Dingbats
    "\U0001F900-\U0001F9FF"  # Supplemental Symbols and Pictographs
    "\U0001FA00-\U0001FA6F"  # Chess Symbols, etc
    "\U00002B50"              # Star
    "\U00002194-\U00002199"  # Arrows
    "\U000021A9-\U000021AA"  # Arrows
    "\U00002328"              # Keyboard
    "\U000023CF"              # Eject
    "\U000023E9-\U000023F3"  # Media controls
    "\U000023F8-\U000023FA"  # Media controls
    "\U000024C2"              # Circled M
    "\U000025AA-\U000025AB"  # Squares
    "\U000025B6"              # Play
    "\U000025C0"              # Reverse play
    "\U000025FB-\U000025FE"  # Squares
    "\U00002600-\U00002604"  # Weather
    "\U0000260E"              # Phone
    "\U00002611"              # Ballot box with check
    "\U00002614-\U00002615"  # Weather + Coffee
    "\U00002618"              # Shamrock
    "\U0000261D"              # Pointing finger
    "\U00002620"              # Skull
    "\U00002622-\U00002623"  # Radioactive + Biohazard
    "\U00002626"              # Orthodox cross
    "\U0000262A"              # Star and crescent
    "\U0000262E-\U0000262F"  # Peace + Yin yang
    "\U00002638-\U0000263A"  # Wheel of dharma + Smiley
    "\U00002640"              # Female sign
    "\U00002642"              # Male sign
    "\U00002648-\U00002653"  # Zodiac
    "\U00002660"              # Spade
    "\U00002663"              # Club
    "\U00002665-\U00002666"  # Heart + Diamond
    "\U00002668"              # Hot springs
    "\U0000267B"              # Recycling
    "\U0000267E-\U0000267F"  # Infinity + Wheelchair
    "\U00002692-\U00002697"  # Hammer + Alembic
    "\U00002699"              # Gear
    "\U0000269B-\U0000269C"  # Atom + Fleur-de-lis
    "\U000026A0-\U000026A1"  # Warning (but we preserve ⚠️)
    "\U000026AA-\U000026AB"  # Circles
    "\U000026B0-\U000026B1"  # Coffin + Funeral urn
    "\U000026BD-\U000026BE"  # Soccer + Baseball
    "\U000026C4-\U000026C5"  # Snowman
    "\U000026C8"              # Thunder
    "\U000026CE"              # Ophiuchus
    "\U000026CF"              # Pick
    "\U000026D1"              # Helmet
    "\U000026D3-\U000026D4"  # Chains
    "\U000026E9-\U000026EA"  # Shinto + Church
    "\U000026F0-\U000026F5"  # Mountain + Sailboat
    "\U000026F7-\U000026FA"  # Skier + Tent
    "\U000026FD"              # Fuel pump
    "\U00002702"              # Scissors
    "\U00002705"              # Check mark (but we preserve ✓)
    "\U00002708-\U0000270D"  # Airplane + Writing hand
    "\U0000270F"              # Pencil
    "\U00002712"              # Nib
    "\U00002714"              # Check mark (preserve ✓)
    "\U00002716"              # X mark (preserve ✗)
    "\U0000271D"              # Latin cross
    "\U00002721"              # Star of David
    "\U00002728"              # Sparkles
    "\U00002733-\U00002734"  # Asterisks
    "\U00002744"              # Snowflake
    "\U00002747"              # Sparkle
    "\U0000274C"              # Cross mark
    "\U0000274E"              # Cross mark
    "\U00002753-\U00002755"  # Question marks
    "\U00002757"              # Exclamation
    "\U00002763-\U00002764"  # Hearts
    "\U00002795-\U00002797"  # Plus/Minus
    "\U000027A1"              # Right arrow
    "\U000027B0"              # Curly loop
    "\U000027BF"              # Double curly loop
    "\U00002934-\U00002935"  # Arrows
    "\U00002B05-\U00002B07"  # Arrows
    "\U00002B1B-\U00002B1C"  # Squares
    "\U00002B55"              # Circle
    "\U00003030"              # Wavy dash
    "\U0000303D"              # Part alternation mark
    "\U00003297"              # Circled ideograph
    "\U00003299"              # Circled ideograph
    "]+"
)

def should_keep_emoji(char):
    """Check if an emoji should be kept"""
    return char in KEEP_EMOJIS

def remove_emojis_from_text(text):
    """Remove emojis from text except for the ones we want to keep"""
    result = []
    emoji_count = 0

    for char in text:
        # Check if it matches our emoji pattern
        if EMOJI_PATTERN.match(char):
            # Only keep if it's in our keep list
            if should_keep_emoji(char):
                result.append(char)
            else:
                emoji_count += 1
                # Don't append (remove it)
        else:
            result.append(char)

    return ''.join(result), emoji_count

def process_html_file(filepath):
    """Process a single HTML file to remove emojis"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content, emoji_count = remove_emojis_from_text(content)

        if emoji_count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return emoji_count

        return 0
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return 0

def main():
    """Main function to process all HTML files"""
    stats = {
        'files_scanned': 0,
        'files_modified': 0,
        'total_emojis_removed': 0,
        'file_details': []
    }

    # Find all HTML files (excluding _legacy directory)
    html_files = []
    for root, dirs, files in os.walk(BASE_DIR):
        # Skip _legacy directory
        if '_legacy' in root:
            continue

        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))

    # Process each file
    for filepath in html_files:
        stats['files_scanned'] += 1
        emoji_count = process_html_file(filepath)

        if emoji_count > 0:
            stats['files_modified'] += 1
            stats['total_emojis_removed'] += emoji_count

            # Get relative path for reporting
            rel_path = os.path.relpath(filepath, BASE_DIR)
            stats['file_details'].append({
                'file': rel_path,
                'emojis_removed': emoji_count
            })

    # Print report
    print("\n" + "="*80)
    print("EMOJI REMOVAL REPORT")
    print("="*80)
    print(f"\nTotal files scanned: {stats['files_scanned']}")
    print(f"Total files modified: {stats['files_modified']}")
    print(f"Total emojis removed: {stats['total_emojis_removed']}")
    print(f"\nEmojis kept: Warning sign, X mark, Checkmark (3 total)")

    if stats['file_details']:
        print("\n" + "-"*80)
        print("FILES MODIFIED:")
        print("-"*80)
        for detail in sorted(stats['file_details'], key=lambda x: x['emojis_removed'], reverse=True):
            print(f"  {detail['file']:<60} {detail['emojis_removed']:>3} emojis removed")

    print("\n" + "="*80)

if __name__ == "__main__":
    main()
