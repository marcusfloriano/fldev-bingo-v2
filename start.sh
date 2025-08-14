#!/bin/bash
xfce4-terminal --title="npm run dev" --hold -e "bash -c '
export NVM_DIR=\"$HOME/.nvm\"
[ -s \"\$NVM_DIR/nvm.sh\" ] && source \"\$NVM_DIR/nvm.sh\"
cd /home/usuario/workspace/fldev-bingo-v2
nvm use 20
npm run dev &
google-chrome --new-window "http://localhost:5173" &
exec bash'"
