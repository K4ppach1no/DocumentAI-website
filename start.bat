@echo off
cd documentai-website

REM Start the backend server
start cmd /k "node server.js"

REM Start the React app
npm start