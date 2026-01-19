@echo off
title WhatsApp Bot Auto-Start
echo Starting WhatsApp Bot...
:: الانتقال إلى مجلد المشروع
cd /d "C:\Users\WinDows\Documents\trae_projects\khaled1593"

:: التحقق من وجود Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not found in PATH!
    echo Please install Node.js or check your environment variables.
    pause
    exit
)

:: تشغيل البوت
echo Running node index.js...
node index.js

:: في حال توقف البوت، انتظر لرؤية الخطأ
pause