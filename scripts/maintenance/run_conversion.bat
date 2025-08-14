@echo off
REM File Name: run_conversion.bat
REM Owner: Andrew
REM Purpose: Runs scripts to append and convert CAPM questions to questions.json
REM Version Control: v1.0
REM Change Log: Created: 04-Aug-2025, v1.0: Initial script for chaining append/convert

set "source=M:\OneDrive\Documents\GitHub\excel_to_json\data"
set "backup_dir=M:\OneDrive\Documents\GitHub\excel_to_json\backup"
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "timestamp=%dt:~0,4%%dt:~4,2%%dt:~6,2%_%dt:~8,2%%dt:~10,2%%dt:~12,2%"

mkdir "%backup_dir%" 2>nul
xcopy "%source%" "%backup_dir%\data_backup_%timestamp%" /E /I /Y
echo Backup created at %backup_dir%\data_backup_%timestamp%

python M:\OneDrive\Documents\GitHub\excel_to_json\add_questions_to_excel.py
python M:\OneDrive\Documents\GitHub\excel_to_json\convert_questions.py
echo Conversion complete