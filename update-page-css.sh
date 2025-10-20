#!/bin/bash
# Script to update HTML pages to use unified CSS

update_page() {
    local file="$1"
    local navbar_color="$2"
    
    echo "Updating $file..."
    
    # Find the line number where </style> appears
    style_end=$(grep -n "</style>" "$file" | head -1 | cut -d: -f1)
    
    if [ -z "$style_end" ]; then
        echo "  No inline styles found, skipping..."
        return
    fi
    
    # Create backup
    cp "$file" "${file}.bak"
    
    # Find where actual content starts (after </style> and script tags)
    content_start=$((style_end + 1))
    
    # Skip any script tags after </style>
    while true; do
        line=$(sed -n "${content_start}p" "$file")
        if [[ "$line" =~ \<script || "$line" =~ \</script || -z "$line" ]]; then
            content_start=$((content_start + 1))
        else
            break
        fi
    done
    
    # Create new file with updated header
    cat > "${file}.new" << 'HEADER_END'
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- SynD-DGF Unified Design System - Forest Canopy Theme -->
<link rel="stylesheet" href="assets/css/synd-design-system.css">

<!-- Lucide Icons -->
<script src="https://unpkg.com/lucide@latest"></script>

HEADER_END
    
    # Append content from original file
    tail -n +${content_start} "$file" >> "${file}.new"
    
    # Replace old file with new one
    mv "${file}.new" "$file"
    
    echo "  ✓ Updated $file (removed $style_end lines of inline CSS)"
}

# Export function for use in subshells
export -f update_page

echo "Starting CSS unification..."
