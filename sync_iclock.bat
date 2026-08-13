@echo off
cd C:\inetpub\wwwroot\HumanResourceManagementSystem
C:\laragon\bin\php\php-8.3.16-Win32-vs16-x64\php.exe artisan iclock:sync-dtr --env=local >> storage/logs/sync_iclock_cron.log 2>&1
exit



@REM @echo off
@REM :: Move to project folder
@REM cd C:\laragon\www\HumanResourceManagementSystem

@REM :: Clear config cache to ensure APP_KEY is loaded
@REM C:\laragon\bin\php\php-8.3.16-Win32-vs16-x64\php.exe artisan config:clear
@REM C:\laragon\bin\php\php-8.3.16-Win32-vs16-x64\php.exe artisan cache:clear

@REM :: Optional: restart queue workers if you use them
@REM C:\laragon\bin\php\php-8.3.16-Win32-vs16-x64\php.exe artisan queue:restart

@REM :: Run your job
@REM C:\laragon\bin\php\php-8.3.16-Win32-vs16-x64\php.exe artisan iclock:sync-dtr --env=local

@REM pause
