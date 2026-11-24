@echo off
cd /d "%~dp0"
echo Golden Greens Spatial Product System
 echo Open http://127.0.0.1:8000
python -m http.server 8000 --bind 127.0.0.1
pause
