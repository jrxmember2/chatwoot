# WhaTicket Community - Auditoria Tecnica e Deploy no EasyPanel

## Visao geral

Este projeto e uma instalacao do WhaTicket Community com:

- `backend` em Node.js + TypeScript + Express + Sequelize + sequelize-typescript
- `frontend` em React + Material UI + Vite
- `mysql` em MariaDB/MySQL
- deploy em container via Docker Compose/Composer no EasyPanel
- integracao principal com WhatsApp Web (`wwebjs`), com persistencia de sessao em volume

Dominios atualmente usados:

- Frontend: `https://chat.serratech.tec.br`
- Backend: `https://backend.serratech.tec.br`

## Como o deploy funciona no EasyPanel

O deploy atual usa um servico do tipo Compose/Composer apontando para o arquivo `docker-compose.easypanel.yml`.

Fluxo de inicializacao:

1. O container `mysql` sobe e expõe internamente a porta `3306`.
2. O container `backend` aguarda o banco ficar acessivel.
3. O `backend` roda migrations automaticamente no boot.
4. O `backend` tenta rodar seeds automaticamente no boot.
5. O `backend` inicia a API Express na porta interna `3000`.
6. O container `frontend` sobe o Nginx na porta interna `80`.
7. O frontend injeta variaveis `VITE_*` no startup e passa a apontar para o backend publicado.
8. O EasyPanel faz o proxy reverso dos dominios para os containers internos.

Resumo do comando efetivo do backend no boot:

- aguarda MySQL
- roda `sequelize db:migrate`
- roda `sequelize db:seed:all` com tolerancia a falha
- inicia `node dist/server.js`

## Containers do compose

Arquivo principal de deploy:

- `docker-compose.easypanel.yml`

Containers existentes:

- `mysql`
- `backend`
- `frontend`

Portas internas:

- `frontend`: `80`
- `backend`: `3000`
- `mysql`: `3306`

## Volumes persistentes importantes

No deploy do EasyPanel, os dados criticos ficam em volumes nomeados:

- `mysql_data`
  - persistencia do banco de dados
  - caminho no container: `/var/lib/mysql`
- `backend_public`
  - persistencia de arquivos publicos do backend
  - caminho no container: `/usr/src/app/public`
- `wwebjs_auth`
  - persistencia da autenticacao/sessao do WhatsApp Web
  - caminho no container: `/usr/src/app/.wwebjs_auth`

Se esses volumes forem removidos:

- `mysql_data`: perde dados do banco
- `backend_public`: perde arquivos publicos e midias persistidas
- `wwebjs_auth`: perde sessoes do WhatsApp e tende a exigir novo pareamento por QR Code

## Variaveis importantes

As variaveis abaixo sao essenciais para o ambiente atual:

- `BACKEND_URL`
  - URL publica do backend usada em links e montagem de midia
- `FRONTEND_URL`
  - origem permitida para CORS e login
- `VITE_BACKEND_URL`
  - URL publica consumida pelo frontend para chamadas HTTP
- `JWT_SECRET`
  - assinatura do token principal
- `JWT_REFRESH_SECRET`
  - assinatura do refresh token
- `MYSQL_ROOT_PASSWORD`
  - senha root do MariaDB
- `MYSQL_DATABASE`
  - nome do banco da aplicacao
- `CHROME_BIN`
  - caminho do Chrome usado pelo WhatsApp Web
- `CHROME_ARGS`
  - flags do Chrome para execucao em container
- `TZ`
  - timezone da aplicacao e do banco

Variaveis observadas no compose atual:

- `PORT=3000` no backend
- `DB_HOST=mysql`
- `DB_PORT=3306`
- `DB_USER=root`
- `DB_PASS=...`
- `DB_NAME=whaticket`
- `PROXY_PORT=443`
- `WHATSAPP_PROVIDER=wwebjs`
- `URL_BACKEND=backend:3000` no frontend
- `FRONTEND_SERVER_NAME=chat.serratech.tec.br`

## DNS no Cloudflare

Configuracao sugerida para os dominios atuais:

1. Criar um registro `A` para `chat.serratech.tec.br` apontando para o IP publico da VPS.
2. Criar um registro `A` para `backend.serratech.tec.br` apontando para o mesmo IP publico da VPS.
3. Se preferir usar `CNAME`, apontar para um host intermediario controlado por voce.
4. Manter SSL no Cloudflare em modo compativel com o certificado configurado no EasyPanel.
5. Se houver problema de WebSocket ou CORS durante testes, validar temporariamente a configuracao do proxy no Cloudflare.

Checklist rapido de DNS:

- `chat.serratech.tec.br` resolve para a VPS
- `backend.serratech.tec.br` resolve para a VPS
- proxy reverso do EasyPanel esta ligado ao dominio correto
- o certificado HTTPS esta ativo

## Como configurar dominio no EasyPanel

Para este projeto, o esperado e:

1. Criar ou manter um projeto no EasyPanel.
2. Criar um servico do tipo Compose/Composer apontando para o repositorio Git.
3. Usar o arquivo `docker-compose.easypanel.yml`.
4. Na area de Domains/Proxy:
   - mapear `chat.serratech.tec.br` para o servico `frontend` na porta `80`
   - mapear `backend.serratech.tec.br` para o servico `backend` na porta `3000`
5. Garantir que o proxy aceite HTTPS e upgrade de WebSocket.

## Como fazer deploy pelo Git

Fluxo recomendado:

1. Commitar as alteracoes no repositorio Git.
2. Fazer push para a branch monitorada pelo EasyPanel.
3. No EasyPanel, abrir o servico Compose/Composer.
4. Sincronizar com a branch configurada.
5. Executar novo deploy/build.
6. Acompanhar a subida dos containers e o proxy.

Boas praticas:

- nao mudar variaveis sensiveis sem necessidade
- nao alterar portas internas do compose atual
- nao remover os volumes persistentes
- se o build falhar por cache, usar rebuild sem cache quando disponivel

## Como acompanhar logs

Opcoes praticas:

- Pelo painel do EasyPanel:
  - abrir o servico
  - verificar logs de `frontend`, `backend` e `mysql`
- Pela VPS, se houver acesso shell:

```bash
docker compose -f docker-compose.easypanel.yml logs -f backend
docker compose -f docker-compose.easypanel.yml logs -f frontend
docker compose -f docker-compose.easypanel.yml logs -f mysql
```

Sinais uteis nos logs:

- `backend`: migrations, seeds, inicializacao do Express, erros de Sequelize, Chrome e WhatsApp
- `frontend`: Nginx, injecao de variaveis e erros de proxy
- `mysql`: inicializacao do banco, autenticacao, corrupcao ou falhas de conexao

## Validacao apos deploy

Checklist minimo:

1. Abrir `https://chat.serratech.tec.br`.
2. Confirmar carregamento do frontend sem erro 502/503.
3. Fazer login com um usuario valido.
4. Abrir a pagina de tickets.
5. Abrir a pagina de conexoes.
6. Confirmar que as sessoes WhatsApp aparecem.
7. Abrir uma conversa e validar envio de mensagem.
8. Validar recebimento de mensagem de retorno.
9. Confirmar que arquivos publicos carregam normalmente.
10. Confirmar que eventos em tempo real continuam funcionando.

Checklist especifico de backend:

- migrations aplicadas sem erro
- seeds sem bloquear o boot
- conexao com MySQL estabelecida
- CORS liberando `FRONTEND_URL`
- Socket.IO aceitando conexoes via proxy

## Troubleshooting

### Service is not reachable

Possiveis causas:

- dominio apontando para IP errado
- proxy do EasyPanel mapeado para a porta errada
- container parado ou reiniciando em loop
- healthcheck do banco impedindo o backend de subir

Validacoes:

- conferir DNS no Cloudflare
- conferir mapeamento de dominio no EasyPanel
- conferir se `frontend` esta na porta `80`
- conferir se `backend` esta na porta `3000`
- abrir logs do container com falha

### Frontend abre mas nao loga

Possiveis causas:

- `VITE_BACKEND_URL` incorreto
- `FRONTEND_URL` e `BACKEND_URL` inconsistentes
- erro de CORS
- backend em crash loop
- cookies/JWT bloqueados por dominio ou proxy

Validacoes:

- abrir DevTools do navegador e verificar a chamada `/auth/login`
- conferir logs do backend no momento do login
- validar `FRONTEND_URL`, `BACKEND_URL` e `VITE_BACKEND_URL`
- checar se o backend responde no dominio publico

### Backend nao sobe

Possiveis causas:

- falha de build TypeScript
- falha de migration ou seed
- erro de model do Sequelize
- falha de conexao com MySQL
- erro de Chrome/Puppeteer no startup do provider

Validacoes:

- ler logs completos do `backend`
- confirmar que o `mysql` esta `healthy`
- verificar `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
- verificar se o build gerou `dist/`

### QR Code nao aparece

Possiveis causas:

- sessao antiga corrompida em `.wwebjs_auth`
- Chrome nao iniciou corretamente
- provider `wwebjs` falhando
- WebSocket nao conectado

Validacoes:

- abrir a pagina de conexoes
- ler logs do backend relacionados a sessao WhatsApp
- confirmar `CHROME_BIN` e `CHROME_ARGS`
- confirmar persistencia do volume `wwebjs_auth`

### Erro de Chrome/Puppeteer

Possiveis causas:

- binario do Chrome ausente
- flags insuficientes para ambiente containerizado
- falta de memoria compartilhada

Validacoes:

- confirmar `CHROME_BIN=/usr/bin/google-chrome-stable`
- confirmar `CHROME_ARGS=--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage`
- confirmar `shm_size: 1gb` no backend
- ler logs do provider WhatsApp

### Erro de CORS

Possiveis causas:

- `FRONTEND_URL` diferente do dominio real acessado
- frontend chamando URL diferente da configurada

Validacoes:

- conferir `FRONTEND_URL`
- conferir `VITE_BACKEND_URL`
- conferir se o navegador esta acessando `https://chat.serratech.tec.br`
- conferir se a API esta em `https://backend.serratech.tec.br`

### Erro de JWT

Possiveis causas:

- `JWT_SECRET` alterado
- `JWT_REFRESH_SECRET` alterado
- refresh token invalido apos redeploy
- cookies nao persistindo por dominio/proxy

Validacoes:

- conferir segredos JWT no ambiente
- validar se o backend esta conseguindo emitir token no login
- testar logout e novo login

### Banco nao conecta

Possiveis causas:

- `mysql` ainda nao ficou pronto
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS` ou `DB_NAME` incorretos
- volume do banco com problema

Validacoes:

- checar logs do `mysql`
- checar healthcheck
- confirmar que `DB_HOST=mysql`
- confirmar que o container `backend` aguarda o banco antes do boot

### WebSocket nao conecta

Possiveis causas:

- proxy sem suporte a upgrade
- backend indisponivel
- dominio do backend inconsistente

Validacoes:

- verificar logs do navegador na conexao Socket.IO
- validar proxy do EasyPanel para upgrade de conexao
- validar disponibilidade do backend

## Estrutura principal do projeto

### Raiz

- `docker-compose.yaml`
- `docker-compose.easypanel.yml`
- `backend/`
- `frontend/`
- `README.md`
- `README-EASYPANEL-SERRATECH.md`

### Backend

Arquivos centrais:

- `backend/src/server.ts`
- `backend/src/app.ts`
- `backend/src/database/index.ts`
- `backend/src/config/database.ts`
- `backend/src/config/auth.ts`
- `backend/src/config/upload.ts`

Models principais:

- `backend/src/models/User.ts`
- `backend/src/models/Contact.ts`
- `backend/src/models/Ticket.ts`
- `backend/src/models/Message.ts`
- `backend/src/models/Whatsapp.ts`
- `backend/src/models/Queue.ts`
- `backend/src/models/QuickAnswer.ts`
- `backend/src/models/ScheduledMessage.ts`

Migrations principais:

- `backend/src/database/migrations/20200717133438-create-users.ts`
- `backend/src/database/migrations/20200717144403-create-contacts.ts`
- `backend/src/database/migrations/20200717145643-create-tickets.ts`
- `backend/src/database/migrations/20200717151645-create-messages.ts`
- `backend/src/database/migrations/20200717170223-create-whatsapps.ts`
- `backend/src/database/migrations/20210108164404-create-queues.ts`
- `backend/src/database/migrations/20210818102605-create-quickAnswers.ts`
- `backend/src/database/migrations/20260427000000-create-scheduled-messages.ts`

Routes principais:

- `backend/src/routes/index.ts`
- `backend/src/routes/authRoutes.ts`
- `backend/src/routes/ticketRoutes.ts`
- `backend/src/routes/messageRoutes.ts`
- `backend/src/routes/whatsappRoutes.ts`
- `backend/src/routes/whatsappSessionRoutes.ts`
- `backend/src/routes/contactRoutes.ts`
- `backend/src/routes/userRoutes.ts`
- `backend/src/routes/queueRoutes.ts`
- `backend/src/routes/quickAnswerRoutes.ts`
- `backend/src/routes/scheduledMessageRoutes.ts`

Controllers principais:

- `backend/src/controllers/SessionController.ts`
- `backend/src/controllers/TicketController.ts`
- `backend/src/controllers/MessageController.ts`
- `backend/src/controllers/WhatsAppController.ts`
- `backend/src/controllers/WhatsAppSessionController.ts`
- `backend/src/controllers/ContactController.ts`
- `backend/src/controllers/UserController.ts`
- `backend/src/controllers/QueueController.ts`
- `backend/src/controllers/QuickAnswerController.ts`
- `backend/src/controllers/ScheduledMessageController.ts`

Services principais:

- `backend/src/services/UserServices/*`
- `backend/src/services/TicketServices/*`
- `backend/src/services/MessageServices/*`
- `backend/src/services/ContactServices/*`
- `backend/src/services/WhatsappService/*`
- `backend/src/services/WbotServices/*`
- `backend/src/services/QueueService/*`
- `backend/src/services/QuickAnswerService/*`
- `backend/src/services/ScheduledMessageServices/ProcessScheduledMessagesService.ts`

Jobs:

- `backend/src/jobs/scheduledMessagesJob.ts`

### Frontend

Arquivos centrais:

- `frontend/src/App.js`
- `frontend/src/index.js`
- `frontend/src/routes/index.js`
- `frontend/src/services/api.js`
- `frontend/src/services/socket-io.js`
- `frontend/src/context/Auth/AuthContext.js`
- `frontend/src/context/WhatsApp/WhatsAppsContext.js`

Componentes principais:

- `frontend/src/components/TicketsManager/index.js`
- `frontend/src/components/TicketsList/index.js`
- `frontend/src/components/Ticket/index.js`
- `frontend/src/components/TicketHeader/index.js`
- `frontend/src/components/TicketInfo/index.js`
- `frontend/src/components/MessagesList/index.js`
- `frontend/src/components/MessageInput/index.js`
- `frontend/src/components/TicketOptionsMenu/index.js`
- `frontend/src/components/TransferTicketModal/index.js`
- `frontend/src/components/ScheduleMessageModal/index.js`
- `frontend/src/components/WhatsAppModal/index.js`
- `frontend/src/components/QrcodeModal/index.js`

Menu lateral:

- `frontend/src/layout/MainListItems.js`

Paginas principais:

- Login: `frontend/src/pages/Login/index.js`
- Conexoes: `frontend/src/pages/Connections/index.js`
- Tickets: `frontend/src/pages/Tickets/index.js`
- Dashboard: `frontend/src/pages/Dashboard/index.js`
- Contacts: `frontend/src/pages/Contacts/index.js`
- Users: `frontend/src/pages/Users/index.js`
- Queues: `frontend/src/pages/Queues/index.js`
- Settings: `frontend/src/pages/Settings/index.js`
- Quick Answers: `frontend/src/pages/QuickAnswers/index.js`
- Signup: `frontend/src/pages/Signup/index.js`

Traducoes:

- `frontend/src/translate/languages/pt.js`
- `frontend/src/translate/languages/en.js`
- `frontend/src/translate/languages/es.js`

## Observacoes operacionais

- O backend serve arquivos publicos por `express.static` a partir de `/public`.
- O frontend usa Vite, mas e servido por Nginx em runtime.
- A injecao de `VITE_*` no frontend e feita no startup do container, nao apenas no build.
- O backend usa CORS baseado em `FRONTEND_URL`.
- O login depende do backend estar operacional e do proxy permitir cookies e chamadas para a API.
- O sistema usa Socket.IO para atualizacoes em tempo real.

## Escopo desta auditoria

Nesta etapa, a intencao e apenas documentar a estrutura e o deploy atual.

Nenhuma regra de negocio deve ser alterada por este README.
