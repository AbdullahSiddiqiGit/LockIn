$logPath = "C:\Users\$env:USERNAME\Scripts\ClosedPrograms.log"
$closedProcessesFile = "C:\Users\$env:USERNAME\Scripts\closed_processes.txt"
#edit the line below to match your desired processes
$processes = @("wallpaper32", "RazerAppEngine", "WhatsApp")


# Formatting for file that gets printed out
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"`n===============================" | Out-File -Append $logPath
"Script Run Time: $timestamp" | Out-File -Append $logPath
"===============================`n" | Out-File -Append $logPath

# Clear previous closed processes list
"" | Out-File -Encoding utf8 $closedProcessesFile

foreach ($proc in $processes) {
    if (Get-Process -Name $proc -ErrorAction SilentlyContinue) {
        Stop-Process -Name $proc -Force -ErrorAction SilentlyContinue
        "$((Get-Date).ToString()) - Closed: $proc" | Out-File -Append $logPath
        Write-Host "$proc closed successfully."
    } else {
        Write-Host "$proc is not running."
    }
}

Write-Host "All selected programs and background processes have been closed."
pause
