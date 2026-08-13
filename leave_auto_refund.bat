@echo off
cd C:\inetpub\wwwroot\HumanResourceManagementSystem
C:\laragon\bin\php\php-8.3.16-Win32-vs16-x64\php.exe artisan auto:leave-auto-refund --env=local >> storage/logs/leave_refund_cron.log 2>&1

exit
