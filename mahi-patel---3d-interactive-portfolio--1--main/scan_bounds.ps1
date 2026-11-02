Add-Type -AssemblyName System.Drawing

function Get-Bounds($imagePath, $startX, $startY, $endX, $endY) {
    $bmp = [System.Drawing.Bitmap]::FromFile($imagePath)
    $minX = $bmp.Width; $maxX = 0; $minY = $bmp.Height; $maxY = 0

    for ($y = $startY; $y -lt $endY; $y += 4) {
        for ($x = $startX; $x -lt $endX; $x += 4) {
            $pixel = $bmp.GetPixel($x, $y)
            if ($pixel.R -lt 240 -or $pixel.G -lt 240 -or $pixel.B -lt 240) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    $bmp.Dispose()
    return @{ minX = $minX; maxX = $maxX; minY = $minY; maxY = $maxY; w = ($maxX - $minX); h = ($maxY - $minY) }
}

$dir = "C:\Users\HP\Desktop\mahi-patel---3d-interactive-portfolio--1--main\public\royce"
$p1 = Join-Path $dir "page_1.png"
$p2 = Join-Path $dir "page_2.png"

$mb = Get-Bounds $p1 2200 1400 3750 2650
Write-Host "Mood Board: minX=$($mb.minX) minY=$($mb.minY) w=$($mb.w) h=$($mb.h)"

$plan = Get-Bounds $p2 100 300 1800 2600
Write-Host "Plan: minX=$($plan.minX) minY=$($plan.minY) w=$($plan.w) h=$($plan.h)"

$elev = Get-Bounds $p2 2100 300 3750 2600
Write-Host "Elevations: minX=$($elev.minX) minY=$($elev.minY) w=$($elev.w) h=$($elev.h)"
