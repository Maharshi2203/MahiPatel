Add-Type -AssemblyName System.Drawing

function Crop-Image($sourcePath, $destPath, $x, $y, $w, $h) {
    $src = [System.Drawing.Bitmap]::FromFile($sourcePath)
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

$src1 = [System.Drawing.Bitmap]::FromFile($p1)
Write-Host "Page 1: $($src1.Width) x $($src1.Height)"
$src1.Dispose()

$src2 = [System.Drawing.Bitmap]::FromFile($p2)
Write-Host "Page 2: $($src2.Width) x $($src2.Height)"
$src2.Dispose()

# From Page 1:
# Mood Board area is on the right-bottom side of Page 1.
# Width ~3000, Height ~2121.
# Mood board starts around x=1900, y=1250, w=1000, h=750 approx.
# Let's crop Mood Board:
Crop-Image $p1 (Join-Path $dir "mood-board.png") 1900 1250 1000 750

# From Page 2:
# Plan is on left: x=150, y=300, w=1150, h=1700
Crop-Image $p2 (Join-Path $dir "plan.png") 150 300 1150 1700

# Elevation All on right: x=1700, y=300, w=1150, h=1700
Crop-Image $p2 (Join-Path $dir "elevations-all.png") 1700 200 1150 1800

# Individual Elevations:
# Elevation A (Top)
Crop-Image $p2 (Join-Path $dir "elevation-a.png") 1750 310 1050 420
# Elevation B (Storefront)
Crop-Image $p2 (Join-Path $dir "elevation-b.png") 1750 720 1050 420
# Elevation C (Grid display)
Crop-Image $p2 (Join-Path $dir "elevation-c.png") 1750 1140 1050 420
# Elevation D (Counter & pendants)
Crop-Image $p2 (Join-Path $dir "elevation-d.png") 1750 1560 1050 430
