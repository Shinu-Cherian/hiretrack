$f = 'Home.jsx'
$lines = Get-Content $f
$keep = $lines[0..539] + $lines[803..($lines.Length - 1)]
$keep | Set-Content $f
Write-Host "Done. Lines kept: $($keep.Length)"
