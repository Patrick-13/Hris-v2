@echo off
cd C:\inetpub\wwwroot\HumanResourceManagementSystem
C:\laragon\bin\php\php-8.3.16-Win32-vs16-x64\php.exe artisan leave:update --env=local >> storage/logs/update_leave_credits.log 2>&1
exit
