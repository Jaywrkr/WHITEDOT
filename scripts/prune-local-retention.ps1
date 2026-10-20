param([Parameter(Mandatory=$true)][string]$PlayerRoot, [switch]$Apply)
$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath($PlayerRoot).TrimEnd('\')
if (!(Test-Path -LiteralPath $root -PathType Container)) { throw 'Player directory missing' }
if ((Get-Item -LiteralPath $root).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Linked root refused' }
$cutoff = [DateTime]::UtcNow.AddDays(-7).AddHours(1)
$relativePaths = @(
    'account-migration-backup\private-app-data.tar',
    'account-migration-backup\immediate-before-migration.tar',
    'account-migration-backup\original-alpha57.apk',
    'account-migration-backup\backup-info.json',
    'account-migration-backup\migration-info.json',
    'emulator.log', 'emulator-error.log'
)
$expired = 0; $deleted = 0
foreach ($relative in $relativePaths) {
    $target = [IO.Path]::GetFullPath((Join-Path $root $relative))
    if (!$target.StartsWith($root + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Path outside player root' }
    $parent = Split-Path -Parent $target
    if ((Test-Path -LiteralPath $parent) -and ((Get-Item -LiteralPath $parent).Attributes -band [IO.FileAttributes]::ReparsePoint)) { throw 'Linked directory refused' }
    if (!(Test-Path -LiteralPath $target -PathType Leaf)) { continue }
    $item = Get-Item -LiteralPath $target
    if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Linked file refused' }
    if ($item.LastWriteTimeUtc -ge $cutoff) { continue }
    $expired++
    if ($Apply) { Remove-Item -LiteralPath $target -Force; $deleted++ }
}
@{expired=$expired; deleted=$deleted; mode=$(if ($Apply) {'apply'} else {'dry-run'})} | ConvertTo-Json -Compress
