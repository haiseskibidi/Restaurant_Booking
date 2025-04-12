@echo off
echo =================================
echo = Table&Go - Локальный HTTP-сервер =
echo =================================
echo.

REM Убедимся, что мы находимся в правильной директории
cd /d "%~dp0"
echo Текущая директория: %CD%
echo.

REM Задаем порт
set PORT=8080

REM Метод 1: Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Запуск Python HTTP-сервера на порту %PORT%...
    echo Сайт доступен по адресу: http://localhost:%PORT%
    echo Для остановки сервера нажмите Ctrl+C
    echo.
    python -m http.server %PORT%
    goto :end
)

REM Метод 2: Python3
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Запуск Python3 HTTP-сервера на порту %PORT%...
    echo Сайт доступен по адресу: http://localhost:%PORT%
    echo Для остановки сервера нажмите Ctrl+C
    echo.
    python3 -m http.server %PORT%
    goto :end
)

REM Метод 3: Node.js
npx --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Запуск HTTP-сервера через NPX на порту %PORT%...
    echo Сайт доступен по адресу: http://localhost:%PORT%
    echo Для остановки сервера нажмите Ctrl+C
    echo.
    npx http-server -p %PORT%
    goto :end
)

REM Если ничего не найдено
echo Не найдены инструменты для запуска HTTP-сервера (Python или Node.js).
echo.
echo Чтобы открыть сайт, посетите в браузере адрес: http://localhost:%PORT%
echo или откройте файл index.html напрямую.
echo.
echo ПРИМЕЧАНИЕ: При открытии напрямую некоторые функции могут работать некорректно.
echo Рекомендуется установить Python или Node.js для запуска полноценного сервера.
pause

:end
echo.
echo Сервер остановлен. 