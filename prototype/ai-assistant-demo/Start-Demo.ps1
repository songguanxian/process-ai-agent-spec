$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Set-Location $repoRoot

$port = 5177
$url = "http://127.0.0.1:$port/prototype/ai-assistant-demo/index.html"

Write-Host "Starting 工序管控系统 AI 助手 Demo..." -ForegroundColor Cyan
Write-Host "URL: $url" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop." -ForegroundColor Yellow

python -m http.server $port --bind 127.0.0.1
