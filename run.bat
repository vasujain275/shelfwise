@echo off
echo Starting ShelfWise Spring Boot Application...

REM Set the JAR and YAML file paths
set JAR_FILE=runtime\shelfwise.jar
set CONFIG_FILE=runtime\application.yaml

:start
echo.
echo Starting server...
java -jar %JAR_FILE% --spring.config.location=file:%CONFIG_FILE%

echo.
echo Server exited. Restarting in 5 seconds. Press Ctrl+C to cancel.
timeout /t 5 >nul
goto start
