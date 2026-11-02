Add-Type -AssemblyName System.Drawing

function Crop-Image($sourcePath, $destPath, $x, $y, $w, $h) {
    $src = [System.Drawing.Bitmap]::FromFile($sourcePath)
    $x = [Math]::Max(0, [int]$x)
    $y = [Math]::Max(0, [int]$y)
    $w = [Math]::Min([int]$w, [int]($src.Width - $x))
    $h = [Math]::Min([int]$h, [int]($src.Height - $y))
    
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

# Elevations individual with clean margins:
Crop-Image $p2 (Join-Path $dir "elevation-a.png") 2200 240 1350 520
Crop-Image $p2 (Join-Path $dir "elevation-b.png") 2200 760 1350 510
Crop-Image $p2 (Join-Path $dir "elevation-c.png") 2200 1270 1350 510
Crop-Image $p2 (Join-Path $dir "elevation-d.png") 2200 1780 1350 540

# Storefront facade crop for Hero/Showcase
Crop-Image $p2 (Join-Path $dir "storefront-facade.png") 2350 780 1150 480
