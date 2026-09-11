[CmdletBinding()]
param(
  [ValidateRange(1, 100)]
  [int]$Quality = 84,

  [switch]$RemoveOriginals
)

$ErrorActionPreference = 'Stop'

if (-not $RemoveOriginals) {
  throw 'Pass -RemoveOriginals to confirm replacement of the converted JPEG and PNG assets.'
}

$clientRoot = Split-Path -Parent $PSScriptRoot
$repositoryRoot = Split-Path -Parent $clientRoot
$publicRoot = Join-Path $clientRoot 'public'
$ffmpeg = Get-Command ffmpeg -ErrorAction Stop

$excludedNamePattern = '(?i)(favicon|wechat-qr|(?:^|-)qr(?:-|$)|icon)'
$losslessNamePattern = '(?i)logo'
$sourceExtensions = @('.jpg', '.jpeg', '.png')
$textExtensions = [System.Collections.Generic.HashSet[string]]::new(
  [string[]]@('.cs', '.cshtml', '.css', '.html', '.js', '.json', '.md', '.mjs', '.scss', '.ts', '.xml', '.yaml', '.yml'),
  [System.StringComparer]::OrdinalIgnoreCase
)

$sources = @(
  Get-ChildItem -LiteralPath $publicRoot -Recurse -File |
    Where-Object {
      $sourceExtensions -contains $_.Extension.ToLowerInvariant() -and
      $_.BaseName -notmatch $excludedNamePattern
    }
)

if ($sources.Count -eq 0) {
  Write-Host 'No JPEG or PNG assets need conversion.'
  exit 0
}

$sourceStemCounts = @{}
foreach ($source in $sources) {
  $stem = Join-Path $source.DirectoryName $source.BaseName
  $sourceStemCounts[$stem] = 1 + ($sourceStemCounts[$stem] ?? 0)
}

$createdTargets = [System.Collections.Generic.List[string]]::new()
$mappings = [System.Collections.Generic.List[object]]::new()
$skipped = [System.Collections.Generic.List[string]]::new()
$originalBytes = [long]0
$webpBytes = [long]0
$referencesStarted = $false

try {
  foreach ($source in $sources) {
    $stem = Join-Path $source.DirectoryName $source.BaseName
    if ($sourceStemCounts[$stem] -gt 1) {
      $sourceType = $source.Extension.TrimStart('.').ToLowerInvariant()
      $target = Join-Path $source.DirectoryName "$($source.BaseName)-$sourceType.webp"
    }
    else {
      $target = [System.IO.Path]::ChangeExtension($source.FullName, '.webp')
    }
    if (Test-Path -LiteralPath $target) {
      throw "Refusing to overwrite existing target: $target"
    }

    $arguments = @(
      '-hide_banner',
      '-loglevel', 'error',
      '-y',
      '-i', $source.FullName,
      '-frames:v', '1',
      '-c:v', 'libwebp',
      '-compression_level', '6'
    )

    if ($source.BaseName -match $losslessNamePattern) {
      $arguments += @('-lossless', '1')
    }
    else {
      $arguments += @('-quality', $Quality.ToString(), '-preset', 'picture')
    }

    $arguments += $target
    & $ffmpeg.Source @arguments
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $target)) {
      throw "WebP conversion failed: $($source.FullName)"
    }

    $targetInfo = Get-Item -LiteralPath $target
    if ($targetInfo.Length -ge $source.Length) {
      Remove-Item -LiteralPath $target -Force
      $skipped.Add($source.FullName)
      continue
    }

    $createdTargets.Add($target)
    $relativeSource = [System.IO.Path]::GetRelativePath($publicRoot, $source.FullName).Replace('\', '/')
    $relativeTarget = [System.IO.Path]::GetRelativePath($publicRoot, $target).Replace('\', '/')
    $mappings.Add([pscustomobject]@{
      Source = $source.FullName
      Target = $target
      OldReference = $relativeSource
      NewReference = $relativeTarget
      OriginalBytes = $source.Length
      WebpBytes = $targetInfo.Length
    })
    $originalBytes += $source.Length
    $webpBytes += $targetInfo.Length
  }

  if ($mappings.Count -eq 0) {
    Write-Host 'WebP was not smaller for any eligible asset; originals were retained.'
    exit 0
  }

  $rg = Get-Command rg -ErrorAction Stop
  $fileArguments = @(
    '--files',
    '-g', '!**/.git/**',
    '-g', '!**/.angular/**',
    '-g', '!**/.tmp-webp-test/**',
    '-g', '!**/artifacts/**',
    '-g', '!**/bin/**',
    '-g', '!**/dist/**',
    '-g', '!**/node_modules/**',
    '-g', '!**/obj/**'
  )
  $candidateFiles = & $rg.Source @fileArguments $repositoryRoot
  if ($LASTEXITCODE -gt 1) {
    throw 'Unable to enumerate repository source files with rg.'
  }

  $referencesStarted = $true
  $changedFiles = 0
  foreach ($candidateFile in $candidateFiles) {
    if (-not $textExtensions.Contains([System.IO.Path]::GetExtension($candidateFile))) {
      continue
    }

    $content = [System.IO.File]::ReadAllText($candidateFile)
    $updated = $content
    foreach ($mapping in $mappings) {
      $updated = $updated.Replace($mapping.OldReference, $mapping.NewReference)
      $updated = $updated.Replace(
        $mapping.OldReference.Replace('/', '\/'),
        $mapping.NewReference.Replace('/', '\/')
      )
    }

    if ($updated -cne $content) {
      [System.IO.File]::WriteAllText($candidateFile, $updated, [System.Text.UTF8Encoding]::new($false))
      $changedFiles++
    }
  }

  foreach ($mapping in $mappings) {
    Remove-Item -LiteralPath $mapping.Source -Force
  }

  $savedBytes = $originalBytes - $webpBytes
  Write-Host "Converted $($mappings.Count) assets and updated $changedFiles source files."
  Write-Host ("Converted assets: {0:N2} MB -> {1:N2} MB ({2:N2} MB saved)." -f ($originalBytes / 1MB), ($webpBytes / 1MB), ($savedBytes / 1MB))
  if ($skipped.Count -gt 0) {
    Write-Host "Retained $($skipped.Count) originals because WebP was not smaller."
  }
}
catch {
  if (-not $referencesStarted) {
    foreach ($target in $createdTargets) {
      if (Test-Path -LiteralPath $target) {
        Remove-Item -LiteralPath $target -Force
      }
    }
  }
  throw
}
