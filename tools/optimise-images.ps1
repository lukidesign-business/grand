# Re-encodes the source PNGs into a tight web budget.
# Sources live in src/assets/img/_raw (excluded from the build); outputs sit alongside.
Add-Type -AssemblyName System.Drawing

$img = (Resolve-Path "$PSScriptRoot\..\src\assets\img").Path
$raw = Join-Path $img "_raw"
$dl  = "$env:USERPROFILE\Downloads"

function Save-Jpeg {
  param([System.Drawing.Bitmap]$Bitmap, [string]$Path, [int]$Quality)
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $ps = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ps.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
  $Bitmap.Save($Path, $codec, $ps)
}

function Convert-Photo {
  param([string]$Source, [string]$Target, [int]$MaxWidth, [int]$Quality = 74)
  if (-not (Test-Path $Source)) { "  MISSING: $Source"; return }
  $src = [System.Drawing.Bitmap]::FromFile($Source)
  $w = $src.Width; $h = $src.Height
  if ($w -gt $MaxWidth) { $h = [int][Math]::Round($h * ($MaxWidth / $w)); $w = $MaxWidth }
  $out = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.DrawImage($src, 0, 0, $w, $h)
  $g.Dispose()
  $dest = Join-Path $img $Target
  Save-Jpeg -Bitmap $out -Path $dest -Quality $Quality
  "  {0,-28} {1,5}x{2,-5} {3,4} KB" -f $Target, $w, $h, [int]((Get-Item $dest).Length / 1KB)
  $out.Dispose(); $src.Dispose()
}

"hero (largest budget - it is the LCP image):"
Convert-Photo "$dl\new-hero-background.png"         "hero-portrait.jpg"        1600 76
Convert-Photo "$dl\new-hero-background.mobiles.png" "hero-portrait-mobile.jpg"  900 76

"`nfull-width section imagery:"
Convert-Photo "$raw\pattaya-aerial.png"  "pattaya-aerial.jpg"  1280 74
Convert-Photo "$raw\thailand-coast.png"  "thailand-coast.jpg"  1280 74
Convert-Photo "$raw\amenities.png"       "amenities.jpg"       1280 74
Convert-Photo "$raw\approach-pool.png"   "approach-pool.jpg"   1280 74
Convert-Photo "$raw\interior-living.png" "interior-living.jpg" 1280 74
Convert-Photo "$raw\lobby.png"           "lobby.jpg"           1280 74

"`ncards and portraits:"
Convert-Photo "$raw\project-01.png" "project-01.jpg" 820 74
Convert-Photo "$raw\project-02.png" "project-02.jpg" 820 74
Convert-Photo "$raw\project-03.png" "project-03.jpg" 820 74
Convert-Photo "$raw\project-04.png" "project-04.jpg" 820 74
Convert-Photo "$raw\ownership.png"  "ownership.jpg"  820 74
Convert-Photo "$raw\bedroom.png"    "bedroom.jpg"    640 74

# Section background washes - displayed at very low opacity, so they can be
# small and soft. Separate files keep the crisp versions out of the wash slots.
"`nlow-opacity section washes:"
Convert-Photo "$raw\pattaya-aerial.png" "wash-city.jpg"    900 58
Convert-Photo "$raw\amenities.png"      "wash-pool.jpg"    900 58
Convert-Photo "$raw\lobby.png"          "wash-lobby.jpg"   900 58
Convert-Photo "$raw\thailand-coast.png" "wash-coast.jpg"   900 58

"`ntotal image payload:"
$sum = (Get-ChildItem $img -File | Measure-Object -Property Length -Sum).Sum
"  {0} files, {1} KB" -f (Get-ChildItem $img -File).Count, [int]($sum / 1KB)
