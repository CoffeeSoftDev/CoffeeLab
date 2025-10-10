$env:MYSQL_HOST = "localhost"
$env:MYSQL_PORT = "3306"
$env:MYSQL_USER = "somx"
$env:MYSQL_PASSWORD = "1234"
$env:MYSQL_DATABASE = "rfwsmqex_erp"

Write-Host "Testing MCP MySQL Server..." -ForegroundColor Cyan
Write-Host "Environment variables set:" -ForegroundColor Green
Write-Host "  MYSQL_HOST: $env:MYSQL_HOST"
Write-Host "  MYSQL_PORT: $env:MYSQL_PORT"
Write-Host "  MYSQL_USER: $env:MYSQL_USER"
Write-Host "  MYSQL_DATABASE: $env:MYSQL_DATABASE"
Write-Host ""
Write-Host "Starting uvx mcp-server-mysql..." -ForegroundColor Yellow

$process = Start-Process -FilePath "uvx" -ArgumentList "mcp-server-mysql" -NoNewWindow -PassThru -RedirectStandardError "mcp-error.log" -RedirectStandardOutput "mcp-output.log"

Start-Sleep -Seconds 3

if ($process.HasExited) {
    Write-Host "Process exited with code: $($process.ExitCode)" -ForegroundColor Red
    Write-Host "`nError log:" -ForegroundColor Red
    Get-Content "mcp-error.log" -ErrorAction SilentlyContinue
    Write-Host "`nOutput log:" -ForegroundColor Yellow
    Get-Content "mcp-output.log" -ErrorAction SilentlyContinue
} else {
    Write-Host "Process is running (PID: $($process.Id))" -ForegroundColor Green
    $process.Kill()
}
