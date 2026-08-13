@echo off
cd C:\inetpub\wwwroot\HumanResourceManagementSystem
C:\laragon\bin\php\php-8.3.16-Win32-vs16-x64\php.exe artisan tko:send-lunch-break-email-reminder --env=local storage/logs/lunch_break_cron.log 2>&1

exit