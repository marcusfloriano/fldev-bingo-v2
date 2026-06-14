# Makefile — operações de produção do Painel de Bingo
#
# Pré-requisito: acesso SSH ao servidor (host configurado no ~/.ssh/config).
# Sobrescreva o host com:  make deploy HOST=meu-alias
#
# Comandos principais:
#   make deploy   → publica a branch atual em produção
#   make status   → estado do processo no servidor
#   make logs     → acompanha os logs do backend
#   make restart  → reinicia o backend
#   make ssh      → abre um shell no servidor

HOST    ?= plenapro
APP_DIR ?= /var/www/bingo
PM2     ?= bingo-server

.DEFAULT_GOAL := help
.PHONY: help deploy status logs restart ssh nginx-reload

help: ## Lista os comandos disponíveis
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

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
