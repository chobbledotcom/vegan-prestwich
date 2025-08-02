#!/usr/bin/env nix-shell
#!nix-shell -i python3 -p python3 python3Packages.pyyaml

import os
import re
import yaml
from datetime import datetime

def parse_month_year(date_str):
    """Convert 'Month Year' to 'YYYY-MM-01' format"""
    try:
        # Handle "Month Year:" format
        date_str = date_str.strip().rstrip(':')
        dt = datetime.strptime(date_str, "%B %Y")
        return dt.strftime("%Y-%m-01")
    except:
        return None

def extract_reviews_from_content(content):
    """Extract reviews from markdown content"""
    reviews = []
    
    # Split content into lines
    lines = content.split('\n')
    
    # Pattern to match review headers like [Date:](URL) or [Date:]
    header_pattern = r'^\[([^\]]+)\](?:\(([^)]+)\))?\s*(.*)$'
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        match = re.match(header_pattern, line)
        
        if match:
            date_str = match.group(1).strip(':')
            url = match.group(2) if match.group(2) else None
            remainder = match.group(3).strip()
            
            # Parse date
            parsed_date = parse_month_year(date_str)
            if not parsed_date:
                i += 1
                continue
            
            # If there's text on the same line after the link
            if remainder and remainder.startswith('"') and remainder.endswith('"'):
                review_data = {
                    'text': remainder.strip('"'),
                    'date': parsed_date
                }
                if url:
                    review_data['url'] = url
                reviews.append(review_data)
            
            # Each subsequent quoted paragraph is a separate review/comment
            j = i + 1
            while j < len(lines):
                next_line = lines[j].strip()
                
                # Stop if we hit another review header
                if re.match(header_pattern, next_line):
                    break
                
                # Each quoted text is a separate item
                if next_line.startswith('"') and next_line.endswith('"'):
                    review_data = {
                        'text': next_line.strip('"'),
                        'date': parsed_date
                    }
                    if url:
                        review_data['url'] = url
                    reviews.append(review_data)
                
                j += 1
            
            i = j
        else:
            i += 1
    
    return reviews

def clean_body_content(body):
    """Remove reviews from body content"""
    lines = body.split('\n')
    new_lines = []
    i = 0
    
    # Pattern to match review headers
    header_pattern = r'^\[([^\]]+)\](?:\(([^)]+)\))?\s*(.*)$'
    
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # Check if it's a review header
        if re.match(header_pattern, stripped):
            # Skip this line
            i += 1
            
            # Skip any following quoted lines
            while i < len(lines):
                next_stripped = lines[i].strip()
                if next_stripped.startswith('"') and next_stripped.endswith('"'):
                    i += 1
                elif not next_stripped:  # Empty line
                    i += 1
                else:
                    break
        else:
            new_lines.append(line)
            i += 1
    
    # Join lines and remove excessive empty lines at the start
    result = '\n'.join(new_lines)
    
    # Remove leading empty lines
    while result.startswith('\n'):
        result = result[1:]
    
    return result

def process_file(filepath):
    """Process a single markdown file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split front matter and body
    if content.startswith('---\n'):
        parts = content.split('---\n', 2)
        if len(parts) >= 3:
            front_matter = parts[1]
            body = parts[2]
        else:
            return False
    else:
        return False
    
    # Parse front matter
    try:
        data = yaml.safe_load(front_matter)
    except:
        return False
    
    # Skip if already has reviews in front matter
    if 'reviews' in data:
        return False
    
    # Extract reviews from body
    reviews = extract_reviews_from_content(body)
    
    if not reviews:
        return False
    
    # Add reviews to front matter
    data['reviews'] = reviews
    
    # Clean body content
    new_body = clean_body_content(body)
    
    # Write back
    new_content = '---\n' + yaml.dump(data, default_flow_style=False, allow_unicode=True) + '---\n' + new_body
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

# Process all .md files in place directory
place_dir = 'place'
processed = 0
skipped = 0

for filename in sorted(os.listdir(place_dir)):
    if filename.endswith('.md') and filename != 'codis-kitchen.md':
        filepath = os.path.join(place_dir, filename)
        if process_file(filepath):
            print(f"Processed: {filename}")
            processed += 1
        else:
            print(f"Skipped: {filename}")
            skipped += 1

print(f"\nTotal: {processed} processed, {skipped} skipped")