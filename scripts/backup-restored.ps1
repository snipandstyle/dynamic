$ErrorActionPreference = 'Stop'
$restoreRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
if ($restoreRoot -ne 'D:\Website\Snipnstyle\snip-style-restored') { throw 'Unexpected backup source.' }
$backupFolder = Join-Path $restoreRoot 'artifacts'
New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null
$archivePath = Join-Path $backupFolder 'snip-style-final-release-source.zip'
if (Test-Path -LiteralPath $archivePath) { throw 'Backup already exists; refusing to overwrite it.' }
$backupItems = Get-ChildItem -LiteralPath $restoreRoot -Force | Where-Object { $_.Name -notin @('node_modules','.git','.next','.next-dev','.next-sandbox','artifacts','dist','tsconfig.tsbuildinfo') -and $_.Name -notlike '.sandbox-*.json' -and ($_.Name -notlike '.env*' -or $_.Name -eq '.env.example') }
Compress-Archive -LiteralPath $backupItems.FullName -DestinationPath $archivePath -CompressionLevel Optimal
Write-Output $archivePath
