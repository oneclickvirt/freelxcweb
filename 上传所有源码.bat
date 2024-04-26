@echo off
setlocal enabledelayedexpansion

set repo_path=C:\Users\86138\Desktop\vue\freelxcweb

git add -A
git commit -am"update"

:push
cd %repo_path%

git push -f origin master
if errorlevel 1 (
    echo Push failed. Retrying in 3 seconds...
    timeout /nobreak /t 3 >nul
    goto push
)

echo Push successful.

endlocal
