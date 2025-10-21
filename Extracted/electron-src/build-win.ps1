
Param([switch]$Pack)
Write-Host "== Team Contact Roster Desktop Build =="
if (-not (Test-Path package.json)) { Write-Error "Run from electron-src"; exit 1 }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { Write-Error "Install Node.js LTS from https://nodejs.org"; exit 1 }
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
if ($Pack) { npm run pack } else { npm start }
