# Instalação do WhaTicket Community no EasyPanel - Serratech

Domínios configurados neste pacote:

- Frontend: https://chat.serratech.tec.br
- Backend/API: https://backend.serratech.tec.br

## Arquivos criados/alterados

1. `docker-compose.easypanel.yml`
   - Compose pronto para EasyPanel com `frontend`, `backend` e `mysql`.
   - Volumes persistentes para banco, arquivos públicos e sessão do WhatsApp.
   - Backend exposto internamente na porta `3000`.
   - Frontend exposto internamente na porta `80`.

2. `frontend/.docker/add-env-vars.sh`
   - Corrigido para injetar variáveis `VITE_*`, pois o frontend usa Vite.

3. `backend/src/models/Message.ts`
   - Corrigida a montagem da URL de mídia para não forçar `:443` ou `:80`.

4. `backend/Dockerfile`
   - Ajustado para executar migrations e seeds automaticamente no boot.
   - Usuário padrão: `admin@whaticket.com`
   - Senha padrão: `admin`

## Passos resumidos

1. Aponte no Cloudflare:
   - `chat.serratech.tec.br` para o IP da VPS.
   - `backend.serratech.tec.br` para o IP da VPS.

2. No EasyPanel, crie um projeto, por exemplo: `atendimento`.

3. Crie um serviço `Compose`.

4. Cole o conteúdo do arquivo `docker-compose.easypanel.yml`.

5. Faça o deploy.

6. Em Domains/Proxy, configure:
   - Domínio `chat.serratech.tec.br` apontando para o serviço `frontend`, porta `80`.
   - Domínio `backend.serratech.tec.br` apontando para o serviço `backend`, porta `3000`.

7. Acesse:
   - https://chat.serratech.tec.br

8. Login inicial:
   - E-mail: `admin@whaticket.com`
   - Senha: `admin`

9. Troque a senha imediatamente após o primeiro acesso.
