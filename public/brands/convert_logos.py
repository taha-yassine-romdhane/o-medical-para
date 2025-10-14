#!/usr/bin/env python3
"""
Script to rename and convert all brand logos to PNG format
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Installing Pillow...")
    os.system(f"{sys.executable} -m pip install pillow")
    from PIL import Image

# Mapping of current filenames to target filenames
FILE_MAPPING = {
    'téléchargement.png': 'svr.png',
    'filorga.jpg': 'filorga.png',
    'sensilis-logo.webp': 'sensilis.png',
    'isdin-logo-png.webp': 'isdin.png',
    'Avène.jpg': 'avene.png',
    'La Roche-Posay.png': 'la-roche-posay.png',
    'Pharmaceris.png': 'pharmaceris.png',
    'Dermacare.png': 'dermacare.png',
    'vichy.png': 'vichy.png',
    'ACTIV_LOGO.webp': 'activ.png',
    'biolane.png': 'biolane.png',
    'Mustela-Symbole.png': 'mustela.png',
    'Orthomed.png': 'orthomed-yuewell.png',
    'Yuewell.jpeg': 'orthomed-yuewell.png',  # Will use this if Orthomed doesn't work
    'spengler.webp': 'spengler.png',
    'Rossmax.jpg': 'rossmax.png',
}

def convert_to_png(input_path, output_path):
    """Convert any image format to PNG"""
    try:
        img = Image.open(input_path)

        # Convert RGBA to RGB if needed (for JPEG compatibility)
        if img.mode == 'RGBA':
            # Create white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])
            img = background
        elif img.mode != 'RGB' and img.mode != 'P':
            img = img.convert('RGB')

        # Resize if too large
        max_width = 500
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

        # Save as PNG
        img.save(output_path, 'PNG', optimize=True)
        return True
    except Exception as e:
        print(f"   Error: {e}")
        return False

def main():
    script_dir = Path(__file__).parent

    print("=" * 70)
    print("Brand Logo Converter - Converting to PNG")
    print("=" * 70)
    print(f"Working directory: {script_dir}\n")

    success_count = 0

    for source_file, target_file in FILE_MAPPING.items():
        source_path = script_dir / source_file
        target_path = script_dir / target_file

        # Skip if source doesn't exist
        if not source_path.exists():
            print(f"[SKIP] {source_file} - file not found")
            continue

        # Skip if target already exists and is not the source
        if target_path.exists() and source_path != target_path:
            print(f"[SKIP] {target_file} - already exists")
            success_count += 1
            continue

        print(f"Converting {source_file} -> {target_file}...")

        if convert_to_png(source_path, target_path):
            print(f"   [SUCCESS] Converted to PNG")

            # Delete source file if different from target
            if source_path != target_path:
                try:
                    source_path.unlink()
                    print(f"   [CLEANUP] Removed original file")
                except:
                    pass

            success_count += 1
        else:
            print(f"   [FAILED] Could not convert")

    print("\n" + "=" * 70)
    print(f"Conversion Complete!")
    print("=" * 70)
    print(f"Successfully converted: {success_count} logos\n")

    # List final PNG files
    print("Final logo files:")
    png_files = sorted(script_dir.glob("*.png"))
    for png_file in png_files:
        if png_file.name not in ['README.md', 'INSTRUCTIONS.md']:
            print(f"  ✓ {png_file.name}")

    print("\nNext steps:")
    print("1. Restart your Next.js dev server")
    print("2. Visit the homepage to see the brand logos!")

if __name__ == "__main__":
    main()
