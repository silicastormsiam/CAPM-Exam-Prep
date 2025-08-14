@echo off
REM File Name: backup_script.bat
REM Owner: Andrew
REM Purpose: Backs up questions.json to a timestamped folder with success/failure output and logging
REM Version Control: v1.3, tracked via GitHub repository
REM Change Log: 
REM   Created: 04-Aug-2025
REM   Updated: 05-Aug-2025, v1.2: Added success/failure output, logging, and pause
REM   Updated: 05-Aug-2025, v1.3: Added metadata, fixed log directory error

set "source=M:\OneDrive\Documents\GitHub\excel_to_json\data"
set "backup_dir=M:\OneDrive\Documents\GitHub\excel_to_json\backup"
set "log_dir=M:\OneDrive\Documents\GitHub\excel_to_json\logs"
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "timestamp=%dt:~0,4%%dt:~4,2%%dt:~6,2%_%dt:~8,2%%dt:~10,2%%dt:~12,2%"
set "backup_path=%backup_dir%\data_backup_%timestamp%"
set "log_file=%log_dir%\backup_log_%timestamp%.txt"

REM Create log directory if it doesn't exist
if not exist "%log_dir%" (
    mkdir "%log_dir%" 2>nul
    if %ERRORLEVEL% neq 0 (
        echo ERROR: Failed to create log directory %log_dir% with code %ERRORLEVEL%. Check permissions or path > "%source%\backup_log_%timestamp%.txt"
        echo ERROR: Failed to create log directory. Log saved to %source%\backup_log_%timestamp%.txt
        pause
        exit /b %ERRORLEVEL%
    )
)

echo Starting backup process at %date% %time% > "%log_file%"
echo Starting backup process...

REM Create backup directory
mkdir "%backup_path%" 2>nul
if %ERRORLEVEL% equ 0 (
    echo SUCCESS: Backup directory created at %backup_path% >> "%log_file%"
    echo SUCCESS: Backup directory created at %backup_path%
) else (
    echo ERROR: Backup directory creation failed with code %ERRORLEVEL%. Check log for details >> "%log_file%"
    echo ERROR: Backup directory creation failed. Check %log_file%
    pause
    exit /b %ERRORLEVEL%
)

REM Back up questions.json
echo Backing up questions.json to %backup_path% >> "%log_file%"
echo Backing up questions.json...
xcopy "%source%\questions.json" "%backup_path%\" /Y >> "%log_file%" 2>&1
if %ERRORLEVEL% equ 0 (
    echo SUCCESS: questions.json backed up >> "%log_file%"
    echo SUCCESS: questions.json backed up
) else (
    echo ERROR: Failed to back up questions.json with code %ERRORLEVEL%. Check log for details >> "%log_file%"
    echo ERROR: Failed to back up questions.json. Check %log_file%
    pause
    exit /b %ERRORLEVEL%
)

echo Backup process completed at %date% %time% >> "%log_file%"
echo Backup process completed. Check log at %log_file%
pause