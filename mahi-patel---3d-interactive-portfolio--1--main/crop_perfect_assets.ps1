Add-Type -AssemblyName System.Drawing

function Crop-Image($sourcePath, $destPath, $x, $y, $w, $h) {
    $src = [System.Drawing.Bitmap]::FromFile($sourcePath)
    # Ensure within bounds
    $x = [Math]::Max(0, $x)
    $y = [Math]::Max(0, $y)
    $w = [Math]::Min($w, $src.Width - $x)
    $h = [Math]::Min($h, $src.Height - $y)
    
    $rect = [System.Drawing.Rectangle]::new($x, $y, $w, $h)
    $cropped = $src.Clone($rect, $src.PixelFormat)
    $cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    $src.Dispose()
    Write-Host "Saved: $destPath ($w x $h)"
}

$dir = "C:\Users\HP\Desktop\mahi-patel---3d-interactive-portfolio--1--main\public\royce"
$p1 = Join-Path $dir "page_1.png"
$p2 = Join-Path $dir "page_2.png"

# 1. Complete Mood Board with Title & Color Swatches
Crop-Image $p1 (Join-Path $dir "mood-board.png") 2350 1440 1280 1020

# 2. Mood Board Photos Only (without title, cleanly framed)
Crop-Image $p1 (Join-Path $dir "mood-board-photos.png") 2420 1580 1150 750

# 3. Color Swatches Strip Only
Crop-Image $p1 (Join-Path $dir "color-swatches.png") 2950 2340 600 100

# 4. Plan (with "PLAN" title and full architectural drawing)
Crop-Image $p2 (Join-Path $dir "plan.png") 230 230 1390 2210

# 5. Plan Drawing Only (Clean drawing without border title)
Crop-Image $p2 (Join-Path $dir "plan-drawing.png") 240 400 1370 2030

# 6. All Elevations
Crop-Image $p2 (Join-Path $dir "elevations-all.png") 2180 230 1300 2250

# 7. Elevation A: Staggered Timber Display Shelving
Crop-Image $p2 (Join-Path $dir "elevation-a.png") 2200 400 1250 490

# 8. Elevation B: Storefront Glass Facade & Royce Sign
Crop-Image $p2 (Join-Path $dir "elevation-b.png") 2200 900 1250 490

# 9. Elevation C: Grid Shelving Display with Chocolate Packaging
Crop-Image $p2 (Join-Path $dir "elevation-c.png") 2200 1430 1250 490

# 10. Elevation D: Cashier Counter with Wave Front & Clustered Pendants
Crop-Image $p2 (Join-Path $dir "elevation-d.png") 2200 1950 1250 510
