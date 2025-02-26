$logPath = "C:\Users\$env:USERNAME\Scripts\ClosedPrograms.log"
$closedProcessesFile = "C:\Users\$env:USERNAME\Scripts\closed_processes.txt"

# Paths to executable files
#Replace with your file paths for the programs you want to restart
$processPaths = @{
    "RazerGameEngine"  = "C:\Program Files\Razer\RazerAppEngine\app-4.0.433\RazerAppEngine.exe"
    #You can choose which apps you want started automatically
   # "WhatsApp"      = "C:\Program Files\WindowsApps\5319275A.WhatsAppDesktop_2.2507.2.0_x64__randomstring\WhatsApp.exe"
   # "Wallpaper32"  = "C:\Program Files (x86)\Steam\steamapps\common\wallpaper_engine\wallpaper32.exe"
}

# Read closed processes list
if (Test-Path $closedProcessesFile) {
    $closedProcesses = Get-Content $closedProcessesFile
} else {
    Write-Host "No processes found to restart."
    exit
}

# Restart processes
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"`n===============================" | Out-File -Append $logPath
"Script Run Time: $timestamp" | Out-File -Append $logPath
"===============================`n" | Out-File -Append $logPath

foreach ($proc in $closedProcesses) {
    if ($processPaths[$proc]) {
        Start-Process -FilePath $processPaths[$proc]
        "$timestamp - Restarted: $proc" | Out-File -Append $logPath
        Write-Host "$proc restarted successfully."
    } else {
        Write-Host "No known path to restart $proc."
    }
}

Write-Host "All selected programs have been restarted."
pause
