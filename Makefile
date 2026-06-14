# Makefile — operações do Painel de Bingo (desenvolvimento + produção)
#
# DEV (local):   make install · make dev · make build · make lint
# PROD (SSH):    make deploy · make status · make logs · make restart · make ssh
#
# Sobrescreva valores:  make deploy HOST=meu-alias   |   make dev NODE_VERSION=20
#
# Os targets de DEV carregam o nvm e usam Node $(NODE_VERSION), porque o Vite 7
# exige Node 20+ (o Node default da máquina pode ser mais antigo).

HOST         ?= plenapro
APP_DIR      ?= /var/www/bingo
PM2          ?= bingo-server
NODE_VERSION ?= 22

SHELL := /bin/bash

# Prefixo que ativa o Node correto via nvm (silencioso; cai pro node do PATH se não houver nvm).
NVM = export NVM_DIR="$$HOME/.nvm"; [ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh"; nvm use $(NODE_VERSION) >/dev/null 2>&1 || true;

.DEFAULT_GOAL := help
.PHONY: help install dev dev-client dev-server build lint preview \
        deploy status logs restart ssh nginx-reload

help: ## Lista os comandos disponíveis
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

# ----- Desenvolvimento (local) -----

install: ## Instala as dependências do frontend e do server
	@bash -c '$(NVM) npm install --legacy-peer-deps && cd server && npm install'

dev: ## Sobe frontend (:5173) + backend (:3001) juntos para desenvolvimento
	@bash -c '$(NVM) npm run dev'

dev-client: ## Sobe apenas o frontend (Vite em :5173)
	@bash -c '$(NVM) npm run dev:client'

dev-server: ## Sobe apenas o backend (Express/WS em :3001)
	@bash -c '$(NVM) npm run dev:server'

build: ## Build de produção local (tsc + vite + build do server)
	@bash -c '$(NVM) npm run build && cd server && npm run build'

lint: ## Roda o eslint
	@bash -c '$(NVM) npm run lint'

preview: ## Serve localmente o build de produção (vite preview)
	@bash -c '$(NVM) npm run preview'

# ----- Produção (via SSH) -----

deploy: ## Faz deploy em produção (envia deploy.sh por SSH e executa)
	ssh $(HOST) APP_DIR=$(APP_DIR) PM2_NAME=$(PM2) 'bash -s' < deploy.sh

status: ## Mostra o status do processo PM2 em produção
	ssh $(HOST) 'pm2 describe $(PM2) | grep -iE "status|restarts|uptime"'

logs: ## Acompanha os logs do backend em produção (Ctrl+C para sair)
	ssh $(HOST) 'pm2 logs $(PM2) --lines 100'

restart: ## Reinicia o backend em produção
	ssh $(HOST) 'pm2 restart $(PM2)'

ssh: ## Abre um shell SSH no servidor de produção
	ssh $(HOST)

nginx-reload: ## Testa e recarrega a configuração do Nginx em produção
	ssh $(HOST) 'nginx -t && systemctl reload nginx'
