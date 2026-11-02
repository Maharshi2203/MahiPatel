Add-Type -AssemblyName System.Runtime.WindowsRuntime

$asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { 
    $_.Name -eq 'AsTask' -and 
    $_.GetParameters().Count -eq 1 -and 
    $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' 
}

Function Await-WinRt($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    return $netTask.Result
}

Function Await-Action($WinRtAction) {
    $asTaskNoResult = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { 
        $_.Name -eq 'AsTask' -and 
        $_.GetParameters().Count -eq 1 -and 
        $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction' 
    }
    $netTask = $asTaskNoResult.Invoke($null, @($WinRtAction))
    $netTask.Wait(-1) | Out-Null
}

[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType = WindowsRuntime] | Out-Null

$pdfPath = 'C:\Users\HP\Desktop\portfolio royceee.pdf'
$fileTask = [Windows.Storage.StorageFile]::GetFileFromPathAsync($pdfPath)
$file = Await-WinRt $fileTask ([Windows.Storage.StorageFile])

$pdfTask = [Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)
$pdf = Await-WinRt $pdfTask ([Windows.Data.Pdf.PdfDocument])

Write-Host "PDF Loaded! Page count: $($pdf.PageCount)"

$outDir = 'C:\Users\HP\Desktop\mahi-patel---3d-interactive-portfolio--1--main\public\royce'
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

for ($i = 0; $i -lt $pdf.PageCount; $i++) {
    $page = $pdf.GetPage($i)
    $outPath = Join-Path $outDir "page_$($i + 1).png"
    
    $outFileTask = [Windows.Storage.StorageFile]::GetFileFromPathAsync($outPath)
    # If file doesn't exist, create it
    if (-not (Test-Path $outPath)) {
        New-Item -ItemType File -Path $outPath -Force | Out-Null
    }
    $outFileTask = [Windows.Storage.StorageFile]::GetFileFromPathAsync($outPath)
    $outFile = Await-WinRt $outFileTask ([Windows.Storage.StorageFile])
    
    $streamTask = $outFile.OpenAsync([Windows.Storage.FileAccessMode]::ReadWrite)
    $stream = Await-WinRt $streamTask ([Windows.Storage.Streams.IRandomAccessStream])
    
    $renderOptions = [Windows.Data.Pdf.PdfPageRenderOptions]::new()
    $renderOptions.DestinationWidth = [uint32]3000 # High resolution render
    
    $renderAction = $page.RenderToStreamAsync($stream, $renderOptions)
    Await-Action $renderAction
    
    $flushAction = $stream.FlushAsync()
    $flushTask = [System.WindowsRuntimeSystemExtensions]::AsTask($flushAction)
    $flushTask.Wait(-1) | Out-Null
    
    $stream.Dispose()
    Write-Host "Rendered page $($i + 1) to $outPath"
}
