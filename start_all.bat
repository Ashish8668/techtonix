@echo off
echo Starting CitizenConnect Hackathon Setup...

start cmd /k "cd nlp-server && python app.py"
start cmd /k "cd frontend && npm run dev"

echo Servers are launching...
echo Make sure you have added your API keys in .env files!
pause
