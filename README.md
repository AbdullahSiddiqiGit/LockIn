# LockIn
Windows Utility to close programs for Gaming/Work mode.
This script allows users to quickly close background programs that consume system resources, making more CPU and RAM available for gaming or other performance-intensive tasks.

Features
Closes user-specified programs with a single script execution.
Logs the closed programs for tracking.
Works on Windows with PowerShell.

Prerequisites
Windows 10/11
PowerShell (Pre-installed on Windows)

Steps:
> Clone the repository or manually download the script file (LockIn.ps1)
> Note: You can also download LockOut.ps1 to resume programs that were closed but that requires more tweaking on the user side. 
> LockIn.ps1 should work right away after editing app names.
> Make folder called 'Scripts' in user folder: (or do it manually)
> mkdir C:\Users\$env:USERNAME\Scripts
> cd C:\Users\$env:USERNAME\Scripts

Enable script execution (if not already enabled):
Open PowerShell as Administrator and run:
Set-ExecutionPolicy Unrestricted -Scope CurrentUser


Open LockIn.ps1 with a text editor.
Modify the $processesToClose list to include the names of the programs you want to close. Example:

$processesToClose = @("chrome", "steam", "wallpaper32")



Run the script to close programs:
C:\Users\$env:USERNAME\Scripts\ClosePrograms.ps1


Check the log file:
A log file ClosedPrograms.log is created in C:\Users\$env:USERNAME\Scripts\ containing a timestamp of closed processes.


(Optional) Add scripts folder to path for your terminal to be able to execute script with just the script name:
eg. $env:Path+=";C:\Users\YourUsername\Scripts\LockIn"

(Optional) Create a desktop shortcut:
Right-click on the script file and select Create Shortcut.
Right-click the shortcut, select Properties, and set:
Target: powershell.exe -File C:\Users\$env:USERNAME\Scripts\ClosePrograms.ps1
Run: Minimized

Click Apply, then OK.



Troubleshooting
Error: "Execution policy prevents running scripts"
Run Set-ExecutionPolicy Unrestricted -Scope CurrentUser in PowerShell (Admin).

Programs not closing?
Check if the program names in $processesToClose match exactly as shown in Task Manager.

Script doesn't run?
Ensure PowerShell is allowed to execute scripts by checking Windows Security settings.
