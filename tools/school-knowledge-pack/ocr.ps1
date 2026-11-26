# Windows built-in OCR (Chinese engine, also reads English) for images and scanned PDFs.
# Input: a UTF-8 file with one "source<TAB>target" pair per line. Originals are only read.
param([string]$ListFile, [int]$PdfWidth = 2000)

$ErrorActionPreference = 'Continue'
# Results go to Node as UTF-8 (the console default here is GBK).
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.FileAccessMode, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Pdf.PdfPageRenderOptions, Windows.Data.Pdf, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Globalization.Language, Windows.Globalization, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.Streams.InMemoryRandomAccessStream, Windows.Storage.Streams, ContentType = WindowsRuntime] | Out-Null

$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
  $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
} | Select-Object -First 1
$asTaskAction = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
  $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction'
} | Select-Object -First 1

function Await($operation, [Type]$type) {
  $task = $asTask.MakeGenericMethod($type).Invoke($null, @($operation))
  $task.Wait(-1) | Out-Null
  $task.Result
}
function Await-Action($operation) {
  $task = $asTaskAction.Invoke($null, @($operation))
  $task.Wait(-1) | Out-Null
}

$language = New-Object Windows.Globalization.Language 'zh-Hans-CN'
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($language)
$engineEn = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage((New-Object Windows.Globalization.Language "en-GB"))
$maxSide = [Windows.Media.Ocr.OcrEngine]::MaxImageDimension

function Read-Stream($stream) {
  $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
  $width = $decoder.PixelWidth
  $height = $decoder.PixelHeight
  if ($width -gt $maxSide -or $height -gt $maxSide) {
    $scale = [Math]::Min($maxSide / $width, $maxSide / $height)
    $transform = New-Object Windows.Graphics.Imaging.BitmapTransform
    $transform.ScaledWidth = [uint32][Math]::Floor($width * $scale)
    $transform.ScaledHeight = [uint32][Math]::Floor($height * $scale)
    $bitmap = Await ($decoder.GetSoftwareBitmapAsync($decoder.BitmapPixelFormat, [Windows.Graphics.Imaging.BitmapAlphaMode]::Premultiplied, $transform, [Windows.Graphics.Imaging.ExifOrientationMode]::RespectExifOrientation, [Windows.Graphics.Imaging.ColorManagementMode]::DoNotColorManage)) ([Windows.Graphics.Imaging.SoftwareBitmap])
  }
  else {
    $bitmap = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
  }
  $result = Await ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
  # The Chinese engine puts spaces between characters; the Node script removes them afterwards.
  $text = ($result.Lines | ForEach-Object { $_.Text }) -join "`n"
  # Mostly English page: the English engine reads it better.
  $cjk = ([regex]::Matches($text, (("[{0}-{1}]") -f [char]0x4e00, [char]0x9fff))).Count
  if ($text.Length -gt 0 -and $cjk -lt $text.Length * 0.05) {
    $english = Await ($engineEn.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
    $text = ($english.Lines | ForEach-Object { $_.Text }) -join "`n"
  }
  $text
}

$utf8 = New-Object System.Text.UTF8Encoding($false)
$pairs = Get-Content -LiteralPath $ListFile -Encoding UTF8 | Where-Object { $_ -match "`t" }
foreach ($line in $pairs) {
  $source, $target = $line -split "`t"
  try {
    $file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($source)) ([Windows.Storage.StorageFile])
    if ([System.IO.Path]::GetExtension($source).ToLowerInvariant() -eq '.pdf') {
      $pdf = Await ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
      $pages = New-Object System.Collections.Generic.List[string]
      for ($i = 0; $i -lt $pdf.PageCount; $i++) {
        $page = $pdf.GetPage($i)
        $memory = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
        $options = New-Object Windows.Data.Pdf.PdfPageRenderOptions
        $options.DestinationWidth = $PdfWidth
        Await-Action ($page.RenderToStreamAsync($memory, $options))
        $pages.Add("--- page $($i + 1) ---`n" + (Read-Stream $memory))
        $memory.Dispose()
        $page.Dispose()
      }
      $text = $pages -join "`n`n"
    }
    else {
      $stream = Await ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
      $text = Read-Stream $stream
      $stream.Dispose()
    }
    [System.IO.File]::WriteAllText($target, $text, $utf8)
    "OK`t$source"
  }
  catch {
    "FAIL`t$source`t$($_.Exception.Message -replace '\s+', ' ')"
  }
}
