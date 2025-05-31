#!/usr/bin/env python3
"""
HTML to PDF converter with precise content measurement
Uses element-by-element measurement for accurate height detection
"""

import asyncio
import argparse
from pathlib import Path
from playwright.async_api import async_playwright
import tempfile
import os

async def convert_slides_precise(output_file: str = "precise_slides.pdf", width: int = 1280):
    """
    Convert all HTML slides to PDF with precise content-based sizing
    """
    current_dir = Path(".")
    html_files = []
    
    for i in range(1, 20):
        page_file = current_dir / f"page{i}.html"
        if page_file.exists():
            html_files.append(page_file)
        else:
            break
    
    if not html_files:
        raise FileNotFoundError("No page*.html files found in current directory")
    
    print(f"Found {len(html_files)} HTML slides to convert")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        temp_pdfs = []
        temp_dir = tempfile.mkdtemp()
        
        try:
            for i, html_file in enumerate(html_files, 1):
                print(f"Processing {html_file.name} ({i}/{len(html_files)})...")
                
                # Set a reasonable viewport first
                await page.set_viewport_size({"width": width, "height": 1200})
                
                # Navigate to HTML file
                file_url = f"file://{html_file.absolute()}"
                await page.goto(file_url, wait_until="networkidle")
                
                # Wait for everything to load
                await page.wait_for_timeout(3000)
                
                # Get precise content measurements
                measurements = await page.evaluate("""
                    () => {
                        // Remove any height constraints
                        const slideContainer = document.querySelector('.slide-container');
                        if (slideContainer) {
                            slideContainer.style.minHeight = 'auto';
                            slideContainer.style.height = 'auto';
                        }
                        
                        document.body.style.height = 'auto';
                        document.body.style.minHeight = 'auto';
                        
                        // Force layout recalculation
                        document.body.offsetHeight;
                        
                        // Wait for any animations
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                // Get actual content bounds
                                const body = document.body;
                                const html = document.documentElement;
                                
                                // Method 1: ScrollHeight
                                const scrollHeight = Math.max(body.scrollHeight, html.scrollHeight);
                                
                                // Method 2: Get bounding rect of all content
                                const allElements = Array.from(document.querySelectorAll('*'));
                                let maxY = 0;
                                let minY = 0;
                                
                                allElements.forEach(el => {
                                    const rect = el.getBoundingClientRect();
                                    if (rect.bottom > maxY) maxY = rect.bottom;
                                    if (rect.top < minY) minY = rect.top;
                                });
                                
                                const boundingHeight = maxY - Math.min(0, minY);
                                
                                // Method 3: Slide container specific
                                let containerHeight = 0;
                                if (slideContainer) {
                                    const containerRect = slideContainer.getBoundingClientRect();
                                    containerHeight = containerRect.height;
                                }
                                
                                // Method 4: Offset height
                                const offsetHeight = Math.max(body.offsetHeight, html.offsetHeight);
                                
                                resolve({
                                    scrollHeight,
                                    boundingHeight,
                                    containerHeight,
                                    offsetHeight,
                                    finalHeight: Math.max(scrollHeight, boundingHeight, containerHeight, offsetHeight, 720)
                                });
                            }, 1000);
                        });
                    }
                """)
                
                print(f"  Measurements: {measurements}")
                
                # Use the actual content height, not the viewport scroll height
                actual_content_height = max(
                    measurements['boundingHeight'],
                    measurements['containerHeight'], 
                    measurements['offsetHeight'],
                    720  # minimum
                )
                
                # Add small buffer to prevent edge cases
                content_height = int(actual_content_height + 30)
                
                print(f"  Final content height: {content_height}px")
                
                # Set viewport to content size
                await page.set_viewport_size({"width": width, "height": content_height})
                await page.wait_for_timeout(1000)
                
                # Generate PDF
                width_inches = width / 96
                height_inches = content_height / 96
                
                temp_pdf = Path(temp_dir) / f"slide_{i:02d}.pdf"
                await page.pdf(
                    path=str(temp_pdf),
                    width=f"{width_inches}in",
                    height=f"{height_inches}in",
                    margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
                    print_background=True,
                    prefer_css_page_size=False
                )
                temp_pdfs.append(temp_pdf)
                print(f"  Generated: {width_inches:.2f}in x {height_inches:.2f}in")
            
            await browser.close()
            
            print("Merging slides...")
            await merge_pdfs(temp_pdfs, output_file)
            
        finally:
            for temp_pdf in temp_pdfs:
                if temp_pdf.exists():
                    temp_pdf.unlink()
            if os.path.exists(temp_dir):
                os.rmdir(temp_dir)
    
    print(f"✅ Precise PDF generated: {output_file}")
    return output_file

async def merge_pdfs(pdf_files: list, output_file: str):
    try:
        from PyPDF2 import PdfMerger
    except ImportError:
        import subprocess
        subprocess.check_call(["pip", "install", "PyPDF2"])
        from PyPDF2 import PdfMerger
    
    merger = PdfMerger()
    for pdf_file in pdf_files:
        merger.append(str(pdf_file))
    merger.write(output_file)
    merger.close()

async def main():
    parser = argparse.ArgumentParser(description="Convert HTML slides with precise content measurement")
    parser.add_argument("-o", "--output", default="precise_slides.pdf", help="Output PDF file")
    parser.add_argument("-w", "--width", type=int, default=1280, help="Browser width")
    
    args = parser.parse_args()
    
    try:
        await convert_slides_precise(args.output, args.width)
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(asyncio.run(main()))