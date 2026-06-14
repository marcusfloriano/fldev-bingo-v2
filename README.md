# Painel de Bingo

Tecnologias: React + TypeScript + Vite + Three.js

## Desenvolvimento

```bash
npm run dev          # frontend (localhost:5173) + backend (localhost:3001) simultaneamente
npm run dev:client   # apenas frontend
npm run dev:server   # apenas backend
npm run build        # build de produção (tsc + vite)
npm run lint         # eslint
```

> O servidor tem seu próprio `package.json` em `server/`. Rode `npm install` lá separadamente se necessário.

## Produção

**URL:** https://bingo.fldev.com.br  
**Servidor:** srv712811.hstgr.cloud (Ubuntu 24.04)  
**Processo:** PM2 (`bingo-server`) → `server/dist/index.js`  
**Frontend:** arquivos estáticos em `/var/www/bingo/dist` servidos pelo Nginx  
**Banco de dados:** `server/src/db.json` (lowdb — estado ao vivo)

### Deploy / atualização

**Forma recomendada** (da sua máquina, via `Makefile` + SSH):

```bash
make deploy    # envia deploy.sh por SSH e executa no servidor
make status    # estado do processo PM2
make logs      # logs do backend
make restart   # reinicia o backend
```

O `deploy.sh` (rodando no servidor) faz: descarta lockfiles sujos → `git pull --ff-only`
→ build do frontend (`dist/`) e do backend (`server/dist/`) → `pm2 restart`.
O estado vivo (`server/dist/db.json`) é preservado no rebuild.

**Manual** (equivalente, direto no servidor):

```bash
cd /var/www/bingo
git checkout -- package-lock.json server/package-lock.json
git pull
npm install --legacy-peer-deps && npm run build
cd server && npm install && npm run build
pm2 restart bingo-server
```

### Nginx

Config em `/etc/nginx/sites-available/bingo.fldev.com.br`:
- `/` → arquivos estáticos em `dist/`
- `/balls`, `/zoom` → proxy para Node.js na porta 3001
- `/ws` → proxy WebSocket para Node.js na porta 3001

### SSL

Certificado Let's Encrypt gerenciado pelo Certbot (renovação automática).

### Variáveis de ambiente

O arquivo `.env.production` controla as URLs do frontend em produção.  
Deixando em branco (padrão), a app usa caminhos relativos via Nginx:

```env
VITE_API_URL=
VITE_WS_URL=
```
