@echo off
title AI Study Assistant
color 0A
echo.
echo  ========================================
echo   AI STUDY ASSISTANT - Starting Server
echo  ========================================
echo.

set PORT=5000
set JWT_SECRET=ai_study_assistant_jwt_secret_2024
set NODE_ENV=development

REM Optional: set your OpenAI API key below to enable real AI responses
REM set OPENAI_API_KEY=sk-your-key-here

REM Optional: set MongoDB URI if you have MongoDB installed
REM set MONGODB_URI=mongodb://localhost:27017/ai-study-assistant

cd /d "%~dp0"
echo  Starting server on http://localhost:5000
echo  Press Ctrl+C to stop
echo.
node server.js
pause
