# Trims the supplied Grand Property emblem to its bounds and writes web-sized PNGs.
Add-Type -AssemblyName System.Drawing

$img = (Resolve-Path "$PSScriptRoot\..\src\assets\img").Path
$src = [System.Drawing.Bitmap]::FromFile((Resolve-Path "$env:USERPROFILE\Downloads\grand-logo.png"))
"source: $($src.Width) x $($src.Height)  $($src.PixelFormat)"

$w = $src.Width; $h = $src.Height
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$d = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$buf = New-Object byte[] ($d.Stride * $h)
[System.Runtime.InteropServices.Marshal]::Copy($d.Scan0, $buf, 0, $buf.Length)
$src.UnlockBits($d)

# does the file actually carry alpha, or is the emblem sitting on white?
$hasAlpha = $false
for ($i = 3; $i -lt $buf.Length; $i += 4) { if ($buf[$i] -lt 250) { $hasAlpha = $true; break } }
"alpha channel present: $hasAlpha"

$minX = $w; $minY = $h; $maxX = -1; $maxY = -1
for ($y = 0; $y -lt $h; $y++) {
  $row = $y * $d.Stride
  for ($x = 0; $x -lt $w; $x++) {
    $i = $row + $x * 4
    $keep = if ($hasAlpha) { $buf[$i + 3] -gt 16 }
            else { (255 - [Math]::Min([Math]::Min($buf[$i], $buf[$i + 1]), $buf[$i + 2])) -gt 18 }
    if ($keep) {
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}

$cw = $maxX - $minX + 1; $ch = $maxY - $minY + 1
$side = [Math]::Max($cw, $ch)
$ox = $minX - [int](($side - $cw) / 2)
$oy = $minY - [int](($side - $ch) / 2)
"content box: ${cw} x ${ch} at ($minX,$minY) -> square $side"

# If the emblem was flattened onto white, key the white out so it sits on dark sections.
$stage = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$sd = $stage.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$sbuf = New-Object byte[] ($sd.Stride * $h)
for ($y = 0; $y -lt $h; $y++) {
  $row = $y * $d.Stride
  for ($x = 0; $x -lt $w; $x++) {
    $i = $row + $x * 4
    if ($hasAlpha) {
      $sbuf[$i] = $buf[$i]; $sbuf[$i+1] = $buf[$i+1]; $sbuf[$i+2] = $buf[$i+2]; $sbuf[$i+3] = $buf[$i+3]
    } else {
      $m = [Math]::Min([Math]::Min($buf[$i], $buf[$i+1]), $buf[$i+2])
      $a = 255 - $m
      if ($a -le 4) {
        $sbuf[$i] = 0; $sbuf[$i+1] = 0; $sbuf[$i+2] = 0; $sbuf[$i+3] = 0
      } else {
        $f = $a / 255.0
        $sbuf[$i]   = [byte][Math]::Max(0.0, [Math]::Min(255.0, ($buf[$i]   - 255.0 * (1 - $f)) / $f))
        $sbuf[$i+1] = [byte][Math]::Max(0.0, [Math]::Min(255.0, ($buf[$i+1] - 255.0 * (1 - $f)) / $f))
        $sbuf[$i+2] = [byte][Math]::Max(0.0, [Math]::Min(255.0, ($buf[$i+2] - 255.0 * (1 - $f)) / $f))
        $sbuf[$i+3] = [byte]$a
      }
    }
  }
}
[System.Runtime.InteropServices.Marshal]::Copy($sbuf, 0, $sd.Scan0, $sbuf.Length)
$stage.UnlockBits($sd)

foreach ($size in @(320, 96)) {
  $out = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.Clear([System.Drawing.Color]::Transparent)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality= [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.DrawImage($stage, (New-Object System.Drawing.Rectangle(0, 0, $size, $size)),
               (New-Object System.Drawing.Rectangle($ox, $oy, $side, $side)),
               [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $name = if ($size -eq 320) { "emblem.png" } else { "emblem-sm.png" }
  $out.Save((Join-Path $img $name), [System.Drawing.Imaging.ImageFormat]::Png)
  "  {0,-16} {1}x{1}  {2} KB" -f $name, $size, [int]((Get-Item (Join-Path $img $name)).Length / 1KB)
  $out.Dispose()
}
$stage.Dispose(); $src.Dispose()
