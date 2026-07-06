param(
  [int]$Port = 5177
)

$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$BundledPython = "C:\Users\Lenovo\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

Write-Host "PROTOTYPE - 工序 AI 助手 PoC"
Write-Host "Serving repository root: $RepoRoot"
Write-Host "URL: http://127.0.0.1:$Port/prototype/ai-assistant-poc/?variant=A"
Write-Host "Variants: A Web侧边栏, B App现场模式, C 运营工作台"

Push-Location $RepoRoot
try {
  if (Test-Path -LiteralPath $BundledPython) {
    & $BundledPython -m http.server $Port --bind 127.0.0.1
  } elseif (Get-Command python -ErrorAction SilentlyContinue) {
    & python -m http.server $Port --bind 127.0.0.1
  } elseif (Get-Command py -ErrorAction SilentlyContinue) {
    & py -3 -m http.server $Port --bind 127.0.0.1
  } else {
    throw "Python 3 not found. Install Python 3 or run with the Codex bundled runtime."
  }
} finally {
  Pop-Location
}
