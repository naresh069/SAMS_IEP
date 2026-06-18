Set-Location -LiteralPath "$PSScriptRoot\sams-backend"
& "C:\Users\Naresh\.vscode\extensions\redhat.java-1.54.0-win32-x64\jre\21.0.10-win32-x86_64\bin\java.exe" -jar "target\sams-backend-1.0.0.jar" *> "$PSScriptRoot\logs\backend.log"
