#!/usr/bin/env bash
#
# Deploy do Painel de Bingo em produção.
#
# Este script roda NO SERVIDOR. Normalmente você não o executa à mão:
# rode `make deploy` na sua máquina, que envia este arquivo por SSH e o executa.
#
# Variáveis sobrescrevíveis (com defaults de produção):
#   APP_DIR   diretório do app no servidor   (default: /var/www/bingo)
#   PM2_NAME  nome do processo PM2            (default: bingo-server)
#   BRANCH    branch a publicar              (default: main)
#
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/bingo}"
PM2_NAME="${PM2_NAME:-bingo-server}"
BRANCH="${BRANCH:-main}"

echo "==> Deploy do bingo em $APP_DIR (branch $BRANCH)"
cd "$APP_DIR"

# O `npm install` reescreve os lockfiles no servidor; descartamos essas
# mudanças locais para o git pull não travar com conflito.
echo "==> Limpando alterações locais de lockfiles"
git checkout -- package-lock.json 2>/dev/null || true
git checkout -- server/package-lock.json 2>/dev/null || true

echo "==> Atualizando código (git pull --ff-only origin $BRANCH)"
git fetch origin "$BRANCH"
git pull --ff-only origin "$BRANCH"

echo "==> Frontend: install + build (gera ./dist, servido pelo Nginx)"
npm install --legacy-peer-deps
npm run build

echo "==> Backend: install + build (gera ./server/dist)"
( cd server && npm install && npm run build )
# Observação: o `tsc` NÃO sobrescreve server/dist/db.json, então o estado
# vivo do bingo (bolas sorteadas / zoom) sobrevive ao rebuild.

echo "==> Reiniciando backend (PM2: $PM2_NAME)"
pm2 restart "$PM2_NAME" --update-env
pm2 save

echo "==> Deploy concluído. Estado atual:"
pm2 describe "$PM2_NAME" | grep -iE "status|restarts|uptime|script path" || true
