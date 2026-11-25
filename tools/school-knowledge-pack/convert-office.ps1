# Converts Word and Excel files to UTF-8 text with Office (opened read-only; originals are never changed).
# Input: a UTF-8 file with one "source<TAB>target" pair per line. Keep this file ASCII-only (PowerShell 5.1 reads it as ANSI).
param([string]$ListFile)

$ErrorActionPreference = 'Continue'
# Results go to Node as UTF-8 (the console default here is GBK).
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
Add-Type -AssemblyName Microsoft.VisualBasic
$fullBar = [string][char]0xFF5C
$utf8 = New-Object System.Text.UTF8Encoding($false)
$word = $null
$excel = $null
# Limits per sheet: price lists and timetables are far smaller than this.
$maxRows = 3000
$maxRead = 20000
$maxCols = 60

function Get-Word {
  if (-not $script:word) {
    $script:word = New-Object -ComObject Word.Application
    $script:word.Visible = $false
    $script:word.DisplayAlerts = 0
    # 3 = msoAutomationSecurityForceDisable: never run macros from school files.
    $script:word.AutomationSecurity = 3
    # Files from the internet open in Protected View; closing the last one shuts the hidden
    # Word down, so keep an empty document open until the end.
    $script:keepAlive = $script:word.Documents.Add()
  }
  $script:word
}

function Get-Excel {
  if (-not $script:excel) {
    $script:excel = New-Object -ComObject Excel.Application
    $script:excel.Visible = $false
    $script:excel.DisplayAlerts = $false
    $script:excel.AskToUpdateLinks = $false
    $script:excel.AutomationSecurity = 3
  }
  $script:excel
}

function Format-Cell([object]$value) {
  if ($null -eq $value) { return '' }
  return ((([string]$value) -replace "[`r`n]+", ' ') -replace '\|', $fullBar).Trim()
}

# One table row; empty cells at the end of the row are left out.
function Format-Row([string[]]$cells) {
  $last = $cells.Count - 1
  while ($last -ge 0 -and -not $cells[$last]) { $last-- }
  if ($last -lt 0) { return $null }
  return '| ' + ($cells[0..$last] -join ' | ') + ' |'
}

$lines = Get-Content -LiteralPath $ListFile -Encoding UTF8 | Where-Object { $_ -match "`t" }
foreach ($line in $lines) {
  $source, $target = $line -split "`t"
  $ext = [System.IO.Path]::GetExtension($source).ToLowerInvariant()
  try {
    if ($ext -in '.doc', '.docx', '.rtf') {
      $w = Get-Word
      # Open(FileName, ConfirmConversions, ReadOnly, AddToRecentFiles, PasswordDocument)
      $doc = $w.Documents.Open($source, $false, $true, $false, 'x-no-password')
      $text = $doc.Content.Text
      $doc.Close(0)
      # Word ends table cells with char 7 and paragraphs with CR.
      $text = $text -replace "`r`a", "`n" -replace "`a", ' | ' -replace "`r", "`n" -replace "`v", "`n"
      [System.IO.File]::WriteAllText($target, $text, $utf8)
      "OK`t$source"
    }
    elseif ($ext -in '.xls', '.xlsx', '.xlsm') {
      $x = Get-Excel
      # Open(FileName, UpdateLinks, ReadOnly, Format, Password)
      $book = $x.Workbooks.Open($source, 0, $true, 5, 'x-no-password')
      $sb = New-Object System.Text.StringBuilder
      foreach ($sheet in $book.Worksheets) {
        if ($sheet.Visible -ne -1) { continue }
        [void]$sb.AppendLine("## Sheet: $($sheet.Name)")
        [void]$sb.AppendLine('')
        $rows = $null
        # Saving one sheet as CSV keeps the displayed text (dates, money formats) instead of raw numbers.
        try {
          $sheet.Copy()
          $tmp = Join-Path $env:TEMP ('kb-sheet-' + [guid]::NewGuid().ToString() + '.csv')
          $x.ActiveWorkbook.SaveAs($tmp, 62)
          $x.ActiveWorkbook.Close($false)
          $parser = New-Object Microsoft.VisualBasic.FileIO.TextFieldParser($tmp, [System.Text.Encoding]::UTF8)
          $parser.SetDelimiters(',')
          $parser.HasFieldsEnclosedInQuotes = $true
          $rows = New-Object System.Collections.ArrayList
          # Some sheets are formatted down to row 1,048,576; stop after enough real rows.
          $read = 0
          while (-not $parser.EndOfData -and $rows.Count -lt $maxRows -and $read -lt $maxRead) {
            $fields = $parser.ReadFields()
            $read++
            if (($fields -join '').Trim()) { [void]$rows.Add($fields) }
          }
          $parser.Close()
          Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue
        }
        catch { $rows = $null }
        if ($rows) {
          foreach ($fields in $rows) {
            $cells = @($fields | Select-Object -First $maxCols | ForEach-Object { Format-Cell $_ })
            $row = Format-Row $cells
            if ($row) { [void]$sb.AppendLine($row) }
          }
        }
        else {
          $used = $sheet.UsedRange
          $values = $used.Resize([Math]::Min($used.Rows.Count, $maxRows), [Math]::Min($used.Columns.Count, $maxCols)).Value2
          if ($values -is [System.Array]) {
            for ($r = 1; $r -le $values.GetLength(0); $r++) {
              $cells = @()
              for ($c = 1; $c -le $values.GetLength(1); $c++) { $cells += Format-Cell $values[$r, $c] }
              $row = Format-Row $cells
              if ($row) { [void]$sb.AppendLine($row) }
            }
          }
          elseif ($null -ne $values) {
            [void]$sb.AppendLine((Format-Cell $values))
          }
        }
        [void]$sb.AppendLine('')
      }
      $book.Close($false)
      [System.IO.File]::WriteAllText($target, $sb.ToString(), $utf8)
      "OK`t$source"
    }
    elseif ($ext -eq '.pptx') {
      # No PowerPoint on this PC: read the slide XML straight from the pptx (a zip file).
      Add-Type -AssemblyName System.IO.Compression.FileSystem
      $zip = [System.IO.Compression.ZipFile]::OpenRead($source)
      $slides = $zip.Entries | Where-Object { $_.FullName -match '^ppt/slides/slide(\d+)\.xml$' } |
        Sort-Object { [int]([regex]::Match($_.FullName, '(\d+)\.xml$').Groups[1].Value) }
      $sb = New-Object System.Text.StringBuilder
      $n = 0
      foreach ($entry in $slides) {
        $n++
        $reader = New-Object System.IO.StreamReader($entry.Open(), [System.Text.Encoding]::UTF8)
        $xml = $reader.ReadToEnd()
        $reader.Close()
        [void]$sb.AppendLine("--- page $n ---")
        foreach ($para in [regex]::Matches($xml, '<a:p>.*?</a:p>|<a:p .*?</a:p>')) {
          $texts = [regex]::Matches($para.Value, '<a:t>([^<]*)</a:t>') | ForEach-Object { $_.Groups[1].Value }
          $line = ($texts -join '').Trim()
          if ($line) { [void]$sb.AppendLine([System.Net.WebUtility]::HtmlDecode($line)) }
        }
        [void]$sb.AppendLine('')
      }
      $zip.Dispose()
      [System.IO.File]::WriteAllText($target, $sb.ToString(), $utf8)
      "OK`t$source"
    }
    else {
      "SKIP`t$source"
    }
  }
  catch {
    "FAIL`t$source`t$($_.Exception.Message -replace '\s+', ' ')"
  }
}

if ($word) { try { $word.Quit(0) | Out-Null } catch {} }
if ($excel) { try { $excel.Quit() | Out-Null } catch {} }
