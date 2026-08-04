# Prepares brand raster assets:
#  1. trims the transparent margin off the supplied signature PNG
#  2. crops the circular emblem out of the supplied hero mockup as a fallback logo
Add-Type -AssemblyName System.Drawing

$img = Resolve-Path "$PSScriptRoot\..\src\assets\img"

# ---- 1. signature: trim to the ink ---------------------------------------------
$src  = [System.Drawing.Bitmap]::FromFile("$img\signature-raw.png")
$w = $src.Width; $h = $src.Height
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$data = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bytes = New-Object byte[] ($data.Stride * $h)
[System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
$src.UnlockBits($data)

$minX = $w; $minY = $h; $maxX = -1; $maxY = -1
for ($y = 0; $y -lt $h; $y++) {
  $row = $y * $data.Stride
  for ($x = 0; $x -lt $w; $x++) {
    if ($bytes[$row + $x * 4 + 3] -gt 8) {   # BGRA -> alpha is byte 3
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}

$pad = 4
$minX = [Math]::Max(0, $minX - $pad); $minY = [Math]::Max(0, $minY - $pad)
$maxX = [Math]::Min($w - 1, $maxX + $pad); $maxY = [Math]::Min($h - 1, $maxY + $pad)
$cw = $maxX - $minX + 1; $ch = $maxY - $minY + 1

$out = New-Object System.Drawing.Bitmap($cw, $ch, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gfx = [System.Drawing.Graphics]::FromImage($out)
$gfx.Clear([System.Drawing.Color]::Transparent)
$gfx.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, $cw, $ch)),
               (New-Object System.Drawing.Rectangle($minX, $minY, $cw, $ch)),
               [System.Drawing.GraphicsUnit]::Pixel)
$gfx.Dispose()
$out.Save("$img\signature.png", [System.Drawing.Imaging.ImageFormat]::Png)
"signature.png  $cw x $ch  (trimmed from $w x $h)"
$out.Dispose(); $src.Dispose()

# ---- 2. emblem crop from the hero mockup ---------------------------------------
$mockPath = "$env:USERPROFILE\Downloads\hero-testt.png"
if (Test-Path $mockPath) {
  $mock  = [System.Drawing.Bitmap]::FromFile($mockPath)
  $crop  = New-Object System.Drawing.Rectangle(27, 11, 106, 106)
  $scale = 4
  $logo  = New-Object System.Drawing.Bitmap(($crop.Width * $scale), ($crop.Height * $scale), [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g2 = [System.Drawing.Graphics]::FromImage($logo)
  $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g2.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g2.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g2.DrawImage($mock, (New-Object System.Drawing.Rectangle(0, 0, $logo.Width, $logo.Height)), $crop, [System.Drawing.GraphicsUnit]::Pixel)
  $g2.Dispose()
  $logo.Save("$img\emblem-crop.png", [System.Drawing.Imaging.ImageFormat]::Png)
  "emblem-crop.png  $($logo.Width) x $($logo.Height)"
  $logo.Dispose(); $mock.Dispose()
}
