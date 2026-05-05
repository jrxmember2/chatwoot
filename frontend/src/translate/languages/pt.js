const messages = {
  pt: {
    translations: {
      signup: {
        title: "Cadastre-se",
        toasts: {
          success: "Usuário criado com sucesso! Faça seu login!!!.",
          fail: "Erro ao criar usuário. Verifique os dados informados.",
        },
        form: {
          name: "Nome",
          email: "Email",
          password: "Senha",
        },
        buttons: {
          submit: "Cadastrar",
          login: "Já tem uma conta? Entre!",
        },
      },
      login: {
        title: "Login",
        form: {
          email: "Email",
          password: "Senha",
        },
        buttons: {
          submit: "Entrar",
          register: "Não tem um conta? Cadastre-se!",
        },
      },
      auth: {
        toasts: {
          success: "Login efetuado com sucesso!",
        },
      },
      dashboard: {
        charts: {
          perDay: {
            title: "Tickets hoje: ",
          },
        },
        messages: {
          inAttendance: {
            title: "Em Atendimento"
          },
          waiting: {
            title: "Aguardando"
          },
          closed: {
            title: "Finalizado"
          }
        }
      },
      connections: {
        title: "Conexões",
        toasts: {
          deleted: "Conexão com o WhatsApp excluída com sucesso!",
        },
        confirmationModal: {
          deleteTitle: "Deletar",
          deleteMessage: "Você tem certeza? Essa ação não pode ser revertida.",
          disconnectTitle: "Desconectar",
          disconnectMessage:
            "Tem certeza? Você precisará ler o QR Code novamente.",
        },
        buttons: {
          add: "Adicionar WhatsApp",
          disconnect: "desconectar",
          tryAgain: "Tentar novamente",
          qrcode: "QR CODE",
          newQr: "Novo QR CODE",
          connecting: "Conectando",
        },
        toolTips: {
          disconnected: {
            title: "Falha ao iniciar sessão do WhatsApp",
            content:
              "Certifique-se de que seu celular esteja conectado à internet e tente novamente, ou solicite um novo QR Code",
          },
          qrcode: {
            title: "Esperando leitura do QR Code",
            content:
              "Clique no botão 'QR CODE' e leia o QR Code com o seu celular para iniciar a sessão",
          },
          connected: {
            title: "Conexão estabelecida!",
          },
          timeout: {
            title: "A conexão com o celular foi perdida",
            content:
              "Certifique-se de que seu celular esteja conectado à internet e o WhatsApp esteja aberto, ou clique no botão 'Desconectar' para obter um novo QR Code",
          },
        },
        table: {
          name: "Nome",
          status: "Status",
          lastUpdate: "Última atualização",
          default: "Padrão",
          actions: "Ações",
          session: "Sessão",
        },
      },
      whatsappModal: {
        title: {
          add: "Adicionar WhatsApp",
          edit: "Editar WhatsApp",
        },
        form: {
          name: "Nome",
          default: "Padrão",
          farewellMessage: "Mensagem de despedida"
        },
        buttons: {
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar",
        },
        success: "WhatsApp salvo com sucesso.",
      },
      qrCode: {
        message: "Leia o QrCode para iniciar a sessão",
      },
      contacts: {
        title: "Contatos",
        toasts: {
          deleted: "Contato excluído com sucesso!",
        },
        searchPlaceholder: "Pesquisar...",
        confirmationModal: {
          deleteTitle: "Deletar ",
          importTitlte: "Importar contatos",
          deleteMessage:
            "Tem certeza que deseja deletar este contato? Todos os tickets relacionados serão perdidos.",
          importMessage: "Deseja importas todos os contatos do telefone?",
        },
        buttons: {
          import: "Importar Contatos",
          add: "Adicionar Contato",
        },
        table: {
          name: "Nome",
          whatsapp: "WhatsApp",
          email: "Email",
          actions: "Ações",
        },
      },
      contactModal: {
        title: {
          add: "Adicionar contato",
          edit: "Editar contato",
        },
        form: {
          mainInfo: "Dados do contato",
          extraInfo: "Informações adicionais",
          name: "Nome",
          number: "Número do Whatsapp",
          email: "Email",
          extraName: "Nome do campo",
          extraValue: "Valor",
        },
        buttons: {
          addExtraInfo: "Adicionar informação",
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar",
        },
        success: "Contato salvo com sucesso.",
      },
      quickAnswersModal: {
        title: {
          add: "Adicionar Resposta Rápida",
          edit: "Editar Resposta Rápida",
        },
        form: {
          shortcut: "Atalho",
          message: "Resposta Rápida",
        },
        buttons: {
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar",
        },
        success: "Resposta Rápida salva com sucesso.",
      },
      queueModal: {
        title: {
          add: "Adicionar fila",
          edit: "Editar fila",
        },
        form: {
          name: "Nome",
          color: "Cor",
          greetingMessage: "Mensagem de saudação",
        },
        buttons: {
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar",
        },
      },
      userModal: {
        title: {
          add: "Adicionar usuário",
          edit: "Editar usuário",
        },
        form: {
          name: "Nome",
          email: "Email",
          password: "Senha",
          profile: "Perfil",
          whatsapp: "Conexão Padrão",
        },
        buttons: {
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar",
        },
        success: "Usuário salvo com sucesso.",
      },
      chat: {
        noTicketMessage: "Selecione um ticket para começar a conversar.",
      },
      ticketsManager: {
        buttons: {
          newTicket: "Novo",
        },
      },
      ticketsQueueSelect: {
        placeholder: "Filas",
      },
      tickets: {
        toasts: {
          deleted: "O ticket que você estava foi deletado.",
        },
        notification: {
          message: "Mensagem de",
        },
        tabs: {
          open: { title: "Inbox" },
          closed: { title: "Resolvidos" },
          search: { title: "Busca" },
        },
        search: {
          placeholder: "Buscar tickets e mensagens",
        },
        buttons: {
          showAll: "Todos",
        },
      },
      transferTicketModal: {
        title: "Transferir Ticket",
        fieldLabel: "Digite para buscar usuários",
        fieldQueueLabel: "Transferir para fila",
        fieldConnectionLabel: "Transferir para conexão",
        fieldQueuePlaceholder: "Selecione uma fila",
        fieldConnectionPlaceholder: "Selecione uma conexão",
        noOptions: "Nenhum usuário encontrado com esse nome",
        buttons: {
          ok: "Transferir",
          cancel: "Cancelar",
        },
      },
      ticketsList: {
        pendingHeader: "Aguardando",
        assignedHeader: "Atendendo",
        noTicketsTitle: "Nada aqui!",
        noTicketsMessage:
          "Nenhum ticket encontrado com esse status ou termo pesquisado",
        connectionTitle: "Conexão que está sendo utilizada atualmente.",
        buttons: {
          accept: "Aceitar",
        },
      },
      newTicketModal: {
        title: "Criar Ticket",
        fieldLabel: "Digite para pesquisar o contato",
        add: "Adicionar",
        buttons: {
          ok: "Salvar",
          cancel: "Cancelar",
        },
      },
      mainDrawer: {
        listItems: {
          dashboard: "Dashboard",
          connections: "Conexões",
          tickets: "Tickets",
          contacts: "Contatos",
          quickAnswers: "Respostas Rápidas",
          queues: "Filas",
          administration: "Administração",
          users: "Usuários",
          settings: "Configurações",
        },
        appBar: {
          user: {
            profile: "Perfil",
            logout: "Sair",
          },
        },
      },
      notifications: {
        noTickets: "Nenhuma notificação.",
      },
      queues: {
        title: "Filas",
        table: {
          name: "Nome",
          color: "Cor",
          greeting: "Mensagem de saudação",
          actions: "Ações",
        },
        buttons: {
          add: "Adicionar fila",
        },
        confirmationModal: {
          deleteTitle: "Excluir",
          deleteMessage:
            "Você tem certeza? Essa ação não pode ser revertida! Os tickets dessa fila continuarão existindo, mas não terão mais nenhuma fila atribuída.",
        },
      },
      queueSelect: {
        inputLabel: "Filas",
      },
      quickAnswers: {
        title: "Respostas Rápidas",
        table: {
          shortcut: "Atalho",
          message: "Resposta Rápida",
          actions: "Ações",
        },
        buttons: {
          add: "Adicionar Resposta Rápida",
        },
        toasts: {
          deleted: "Resposta Rápida excluída com sucesso.",
        },
        searchPlaceholder: "Pesquisar...",
        confirmationModal: {
          deleteTitle:
            "Você tem certeza que quer excluir esta Resposta Rápida: ",
          deleteMessage: "Esta ação não pode ser revertida.",
        },
      },
      users: {
        title: "Usuários",
        table: {
          name: "Nome",
          email: "Email",
          profile: "Perfil",
          whatsapp: "Conexão Padrão",
          actions: "Ações",
        },
        buttons: {
          add: "Adicionar usuário",
        },
        toasts: {
          deleted: "Usuário excluído com sucesso.",
        },
        confirmationModal: {
          deleteTitle: "Excluir",
          deleteMessage:
            "Todos os dados do usuário serão perdidos. Os tickets abertos deste usuário serão movidos para a fila.",
        },
      },
      settings: {
        success: "Configurações salvas com sucesso.",
        title: "Configurações",
        settings: {
          userCreation: {
            name: "Criação de usuário",
            options: {
              enabled: "Ativado",
              disabled: "Desativado",
            },
          },
        },
      },
      branding: {
        title: "Branding",
        description:
          "Defina logos, favicon, nome do sistema, cores e textos exibidos no login e na area interna.",
        fields: {
          loginLogo: "Logo da tela de login",
          internalLogo: "Logo da area interna",
          favicon: "Favicon",
          systemName: "Nome do sistema",
          pageTitle: "Titulo da pagina",
          primaryColor: "Cor primaria",
          secondaryColor: "Cor secundaria",
          loginFooterText: "Texto de rodape do login",
          showLoginLogo: "Exibir logo na tela de login",
          showInternalLogo: "Exibir logo na area interna",
        },
        buttons: {
          open: "Abrir Branding",
          selectLoginLogo: "Selecionar logo do login",
          selectInternalLogo: "Selecionar logo interna",
          selectFavicon: "Selecionar favicon",
          save: "Salvar",
          saving: "Salvando...",
        },
        preview: {
          empty: "Nenhum arquivo enviado.",
          current: "Mantendo arquivo atual.",
        },
        success: "Branding salvo com sucesso.",
      },
      messagesList: {
        header: {
          assignedTo: "Atribuído à:",
          buttons: {
            return: "Retornar",
            resolve: "Resolver",
            reopen: "Reabrir",
            accept: "Aceitar",
          },
        },
      },
      messagesInput: {
        placeholderOpen: "Digite uma mensagem ou tecle ''/'' para utilizar as respostas rápidas cadastrada",
        placeholderClosed:
          "Reabra ou aceite esse ticket para enviar uma mensagem.",
        signMessage: "Assinar",
      },
      contactDrawer: {
        header: "Dados do contato",
        buttons: {
          edit: "Editar contato",
        },
        extraInfo: "Outras informações",
      },
      ticketOptionsMenu: {
        delete: "Deletar",
        transfer: "Transferir",
        scheduleMessage: "Agendar envio",
        confirmationModal: {
          title: "Deletar o ticket do contato",
          titleFrom: "do contato ",
          message:
            "Atenção! Todas as mensagens relacionadas ao ticket serão perdidas.",
        },
        buttons: {
          delete: "Excluir",
          cancel: "Cancelar",
        },
      },
      scheduleMessageModal: {
        title: "Agendar envio de mensagem",
        contact: "Nome do contato",
        number: "Numero do contato",
        ticket: "ID do ticket",
        message: "Mensagem",
        attachFile: "Anexar arquivo",
        selectedFile: "Arquivo selecionado",
        connection: "Conexao de saida",
        selectConnection: "Selecione uma conexao",
        sendDate: "Data do envio",
        sendTime: "Hora do envio",
        signMessage: "Assinar mensagem",
        cancel: "Cancelar",
        confirm: "Agendar envio",
        success: "Mensagem agendada com sucesso.",
        errors: {
          required: "Informe uma mensagem ou anexe um arquivo.",
          connectionRequired: "Selecione a conexao pela qual a mensagem sera enviada.",
          pastDate: "Informe uma data e hora futuras.",
        },
      },
      confirmationModal: {
        buttons: {
          confirm: "Ok",
          cancel: "Cancelar",
        },
      },
      messageOptionsMenu: {
        delete: "Deletar",
        reply: "Responder",
        confirmationModal: {
          title: "Apagar mensagem?",
          message: "Esta ação não pode ser revertida.",
        },
      },
      backendErrors: {
        ERR_NO_OTHER_WHATSAPP: "Deve haver pelo menos um WhatsApp padrão.",
        ERR_NO_DEF_WAPP_FOUND:
          "Nenhum WhatsApp padrão encontrado. Verifique a página de conexões.",
        ERR_WAPP_NOT_INITIALIZED:
          "Esta sessão do WhatsApp não foi inicializada. Verifique a página de conexões.",
        ERR_WAPP_CHECK_CONTACT:
          "Não foi possível verificar o contato do WhatsApp. Verifique a página de conexões",
        ERR_WAPP_INVALID_CONTACT: "Este não é um número de Whatsapp válido.",
        ERR_WAPP_DOWNLOAD_MEDIA:
          "Não foi possível baixar mídia do WhatsApp. Verifique a página de conexões.",
        ERR_INVALID_CREDENTIALS:
          "Erro de autenticação. Por favor, tente novamente.",
        ERR_SENDING_WAPP_MSG:
          "Erro ao enviar mensagem do WhatsApp. Verifique a página de conexões.",
        ERR_DELETE_WAPP_MSG: "Não foi possível excluir a mensagem do WhatsApp.",
        ERR_OTHER_OPEN_TICKET: "Já existe um tíquete aberto para este contato.",
        ERR_SESSION_EXPIRED: "Sessão expirada. Por favor entre.",
        ERR_USER_CREATION_DISABLED:
          "A criação do usuário foi desabilitada pelo administrador.",
        ERR_NO_PERMISSION: "Você não tem permissão para acessar este recurso.",
        ERR_DUPLICATED_CONTACT: "Já existe um contato com este número.",
        ERR_NO_SETTING_FOUND: "Nenhuma configuração encontrada com este ID.",
        ERR_NO_CONTACT_FOUND: "Nenhum contato encontrado com este ID.",
        ERR_NO_TICKET_FOUND: "Nenhum tíquete encontrado com este ID.",
        ERR_NO_USER_FOUND: "Nenhum usuário encontrado com este ID.",
        ERR_NO_WAPP_FOUND: "Nenhum WhatsApp encontrado com este ID.",
        ERR_TICKET_NO_WHATSAPP:
          "Este ticket nao possui uma conexao WhatsApp vinculada.",
        ERR_SCHEDULED_MESSAGE_EMPTY:
          "Informe uma mensagem ou anexe um arquivo para agendar.",
        ERR_SCHEDULED_MESSAGE_DATE_REQUIRED:
          "A data e hora do agendamento sao obrigatorias.",
        ERR_SCHEDULED_MESSAGE_INVALID_DATE:
          "A data informada para o agendamento e invalida.",
        ERR_SCHEDULED_MESSAGE_PAST_DATE:
          "Nao e possivel agendar mensagens no passado.",
        ERR_SCHEDULED_MESSAGE_INVALID_TICKET_RELATION:
          "Os dados do ticket informados nao conferem com a conversa atual.",
        ERR_NO_SCHEDULED_MESSAGE_FOUND:
          "Nenhum agendamento encontrado com este ID.",
        ERR_SCHEDULED_MESSAGE_CANCEL_NOT_ALLOWED:
          "Somente agendamentos pendentes podem ser cancelados.",
        ERR_INVALID_BRANDING_MEDIA_TYPE:
          "Envie apenas imagens PNG, JPG, JPEG, WEBP ou ICO para o branding.",
        ERR_NO_BRANDING_FILE_SENT:
          "Selecione pelo menos um arquivo para upload do branding.",
        ERR_BRANDING_INVALID_COLOR:
          "Informe cores validas no formato hexadecimal.",
        ERR_CREATING_MESSAGE: "Erro ao criar mensagem no banco de dados.",
        ERR_CREATING_TICKET: "Erro ao criar tíquete no banco de dados.",
        ERR_FETCH_WAPP_MSG:
          "Erro ao buscar a mensagem no WhtasApp, talvez ela seja muito antiga.",
        ERR_QUEUE_COLOR_ALREADY_EXISTS:
          "Esta cor já está em uso, escolha outra.",
        ERR_WAPP_GREETING_REQUIRED:
          "A mensagem de saudação é obrigatório quando há mais de uma fila.",
      },
    },
  },
};

messages.pt.translations.connections.importOldMessages =
  "Baixar mensagens do celular";
messages.pt.translations.connections.importOldMessagesDays =
  "Quantidade de dias para buscar";
messages.pt.translations.connections.importOldMessagesHelp =
  "O sistema tentara importar as conversas disponiveis no WhatsApp Web dentro desse periodo. Dependendo do WhatsApp, nem todo o historico antigo pode estar disponivel.";
messages.pt.translations.connections.manageDescription =
  "Gerencie conexoes, sessoes, QR Code e sincronizacao do WhatsApp.";
messages.pt.translations.connections.importOldMessagesStatus =
  "Status da sincronizacao";
messages.pt.translations.connections.importOldMessagesNow =
  "Sincronizar agora";
messages.pt.translations.connections.importOldMessagesRunning =
  "Sincronizacao em andamento";
messages.pt.translations.connections.importOldMessagesDone = "Concluido";
messages.pt.translations.connections.importOldMessagesFailed = "Falhou";
messages.pt.translations.connections.importOldMessagesPending = "Pendente";
messages.pt.translations.connections.importOldMessagesIdle = "Nao iniciado";
messages.pt.translations.connections.importOldMessagesLastRun =
  "Ultima sincronizacao";
messages.pt.translations.connections.importOldMessagesValidationDays =
  "Informe uma quantidade de dias entre 1 e 90.";
messages.pt.translations.connections.importOldMessagesStarted =
  "Sincronizacao de mensagens antigas iniciada com sucesso.";
messages.pt.translations.connections.importOldMessagesAlreadyRunning =
  "Ja existe uma sincronizacao em andamento para esta conexao.";
messages.pt.translations.connections.provider = "Provedor";
messages.pt.translations.connections.evolutionInstance = "Instancia Evolution";
messages.pt.translations.connections.evolutionInfo =
  "Esta conexao usa uma instancia existente da Evolution API e nao exibe QR Code localmente.";
messages.pt.translations.connections.evolutionInstanceRequired =
  "Informe o nome da instancia cadastrada na Evolution API.";
messages.pt.translations.connections.importNotAvailableEvolution =
  "A importacao de historico antigo nao esta disponivel para conexoes Evolution API.";
messages.pt.translations.connections.providers = {
  wwebjs: "WhatsApp Web (QR Code)",
  whaileys: "Whaileys",
  evolution: "Evolution API"
};
messages.pt.translations.connections.statusLabels = {
  connected: "Online",
  syncing: "Sincronizando",
  disconnected: "Offline"
};
messages.pt.translations.connections.buttons.syncStatus = "Sincronizar";
messages.pt.translations.connections.buttons.syncingStatus = "Sincronizando";
messages.pt.translations.whatsappModal.form.provider = "Provedor da conexao";
messages.pt.translations.whatsappModal.form.evolutionInstanceName =
  "Nome da instancia na Evolution";
messages.pt.translations.whatsappModal.form.evolutionInfo =
  "Ao usar Evolution API, o WhaTicket nao gera QR Code nesta tela. A conexao passa a usar a instancia informada na Evolution.";
messages.pt.translations.mainDrawer.listItems.attendance = "Atendimento";
messages.pt.translations.mainDrawer.listItems.settingsGroup =
  "Configuracoes";
messages.pt.translations.backendErrors.ERR_OLD_MESSAGES_IMPORT_INVALID_DAYS =
  "Informe uma quantidade de dias entre 1 e 90 para a sincronizacao.";
messages.pt.translations.backendErrors.ERR_OLD_MESSAGES_IMPORT_ALREADY_RUNNING =
  "Ja existe uma sincronizacao em andamento para esta conexao.";
messages.pt.translations.backendErrors.ERR_OLD_MESSAGES_IMPORT_UNSUPPORTED =
  "A sincronizacao de mensagens antigas esta disponivel apenas para conexoes wwebjs.";
messages.pt.translations.mainDrawer.listItems.campaignsGroup = "Campanhas";
messages.pt.translations.mainDrawer.listItems.automationsGroup = "Automacoes";
messages.pt.translations.integrations = {
  title: "Integracoes",
  description: "Configure N8N, ChatGPT e Evolution API com seguranca.",
  open: "Abrir Integracoes",
  save: "Salvar",
  saving: "Salvando...",
  success: "Integracoes salvas com sucesso.",
  keepSecretHint: "Deixe em branco para manter o segredo atual.",
  n8n: {
    title: "N8N",
    active: "Ativar integracao com N8N",
    baseUrl: "URL base do N8N",
    webhookUrl: "Webhook padrao",
    secret: "Token ou secret"
  },
  chatgpt: {
    title: "ChatGPT",
    active: "Ativar ChatGPT",
    apiKey: "API Key",
    model: "Modelo",
    basePrompt: "Prompt base",
    temperature: "Temperatura",
    maxTokens: "Limite de tokens",
    queues: "Filas permitidas",
    suggestReply: "Gerar sugestao",
    summarize: "Resumir conversa",
    summaryTitle: "Resumo da conversa"
  },
  evolution: {
    title: "Evolution API",
    active: "Ativar Evolution API",
    baseUrl: "URL base",
    apiKey: "API Key",
    instance: "Instancia padrao",
    useAsDefault: "Usar Evolution como padrao",
    test: "Testar conexao",
    testing: "Testando...",
    testSuccess: "Conexao com Evolution validada com sucesso."
  }
};
messages.pt.translations.webhooks = {
  title: "Webhooks",
  description: "Gerencie webhooks genericos e acompanhe os disparos.",
  open: "Abrir Webhooks",
  add: "Novo webhook",
  save: "Salvar",
  cancel: "Cancelar",
  close: "Fechar",
  success: "Webhook salvo com sucesso.",
  deleted: "Webhook removido com sucesso.",
  test: "Testar",
  testSuccess: "Disparo de teste enviado.",
  dialogTitle: "Webhook",
  deleteConfirmTitle: "Remover webhook",
  deleteConfirmMessage: "Tem certeza que deseja remover este webhook?",
  logsTitle: "Logs do webhook",
  fields: {
    name: "Nome",
    url: "URL",
    secret: "Secret",
    events: "Eventos",
    active: "Ativo"
  },
  table: {
    name: "Nome",
    url: "URL",
    events: "Eventos",
    status: "Ultimo status",
    actions: "Acoes"
  },
  logs: {
    event: "Evento",
    status: "Status",
    error: "Erro"
  },
  events: {
    ticket_created: "Ticket criado",
    ticket_updated: "Ticket atualizado",
    ticket_closed: "Ticket fechado",
    message_received: "Mensagem recebida",
    message_sent: "Mensagem enviada",
    contact_created: "Contato criado",
    whatsapp_connected: "WhatsApp conectado",
    whatsapp_disconnected: "WhatsApp desconectado",
    campaign_sent: "Campanha enviada"
  }
};
messages.pt.translations.campaigns = {
  title: "Campanhas",
  add: "Nova campanha",
  newCampaign: "Criar campanha",
  save: "Salvar campanha",
  saving: "Salvando...",
  cancel: "Cancelar",
  success: "Campanha criada com sucesso.",
  canceled: "Campanha cancelada com sucesso.",
  failed: "falhas",
  cancelTitle: "Cancelar campanha",
  cancelMessage: "Deseja cancelar esta campanha?",
  limitInfo: "Voce pode enviar para ate {{count}} contatos nas proximas 24h.",
  fields: {
    name: "Nome",
    whatsapp: "Conexao WhatsApp",
    message: "Mensagem",
    scheduledAt: "Agendar para",
    file: "Anexo",
    contacts: "Contatos",
    contactsPlaceholder: "Busque e selecione contatos"
  },
  table: {
    name: "Nome",
    whatsapp: "Conexao",
    status: "Status",
    scheduledAt: "Agendamento",
    results: "Resultados",
    actions: "Acoes"
  }
};
messages.pt.translations.flowbuilder = {
  title: "Flowbuilder",
  add: "Novo fluxo",
  save: "Salvar fluxo",
  cancel: "Cancelar",
  success: "Fluxo salvo com sucesso.",
  deleted: "Fluxo removido com sucesso.",
  active: "Ativo",
  inactive: "Inativo",
  dialogTitle: "Fluxo",
  deleteTitle: "Remover fluxo",
  deleteMessage: "Tem certeza que deseja remover este fluxo?",
  nodesTitle: "Passos do fluxo",
  addStep: "Adicionar passo",
  removeStep: "Remover passo",
  noNextStep: "Sem proximo passo",
  step: "Passo",
  fields: {
    name: "Nome",
    description: "Descricao",
    keyword: "Palavra-chave",
    active: "Fluxo ativo",
    nodeLabel: "Titulo do passo",
    nodeType: "Tipo do passo",
    message: "Mensagem",
    conditionValue: "Texto para verificar",
    queue: "Fila",
    webhookUrl: "URL do webhook",
    nextStep: "Proximo passo",
    trueNext: "Se verdadeiro",
    falseNext: "Se falso"
  },
  nodeTypes: {
    send_message: "Enviar mensagem",
    condition_contains: "Condicao: contem texto",
    transfer_queue: "Transferir para fila",
    close_ticket: "Encerrar atendimento",
    webhook: "Webhook"
  },
  table: {
    name: "Nome",
    keyword: "Palavra-chave",
    active: "Ativo",
    steps: "Passos",
    actions: "Acoes"
  }
};
messages.pt.translations.backendErrors.ERR_WEBHOOK_INVALID_URL =
  "Informe uma URL valida para o webhook.";
messages.pt.translations.backendErrors.ERR_WEBHOOK_INVALID_PAYLOAD =
  "Preencha nome, URL e ao menos um evento para o webhook.";
messages.pt.translations.backendErrors.ERR_NO_WEBHOOK_FOUND =
  "Nenhum webhook encontrado com este ID.";
messages.pt.translations.backendErrors.ERR_INTEGRATION_INVALID_URL =
  "Informe uma URL valida para a integracao.";
messages.pt.translations.backendErrors.ERR_CHATGPT_NOT_CONFIGURED =
  "Configure e ative a integracao ChatGPT antes de usar este recurso.";
messages.pt.translations.backendErrors.ERR_CHATGPT_QUEUE_NOT_ALLOWED =
  "A fila deste ticket nao esta habilitada para ChatGPT.";
messages.pt.translations.backendErrors.ERR_CHATGPT_REQUEST_FAILED =
  "Nao foi possivel obter resposta do ChatGPT.";
messages.pt.translations.backendErrors.ERR_CHATGPT_EMPTY_RESPONSE =
  "O ChatGPT nao retornou conteudo utilizavel.";
messages.pt.translations.backendErrors.ERR_CHATGPT_INVALID_TEMPERATURE =
  "Informe uma temperatura entre 0 e 2.";
messages.pt.translations.backendErrors.ERR_CHATGPT_INVALID_MAX_TOKENS =
  "Informe um limite de tokens entre 100 e 4000.";
messages.pt.translations.backendErrors.ERR_EVOLUTION_INVALID_URL =
  "Informe uma URL valida para a Evolution API.";
messages.pt.translations.backendErrors.ERR_EVOLUTION_TEST_FAILED =
  "Falha ao validar a conexao com a Evolution API.";
messages.pt.translations.backendErrors.ERR_EVOLUTION_NOT_CONFIGURED =
  "Configure URL, API Key e instancia da Evolution API antes de usar este provedor.";
messages.pt.translations.backendErrors.ERR_EVOLUTION_INSTANCE_REQUIRED =
  "Informe o nome da instancia da Evolution API para esta conexao.";
messages.pt.translations.backendErrors.ERR_EVOLUTION_WEBHOOK_UNAUTHORIZED =
  "Webhook da Evolution API rejeitado por token invalido.";
messages.pt.translations.backendErrors.ERR_EVOLUTION_BACKEND_URL_NOT_CONFIGURED =
  "A URL publica do backend nao esta configurada para registrar o webhook da Evolution.";
messages.pt.translations.backendErrors.ERR_INVALID_CAMPAIGN_MEDIA_TYPE =
  "Anexe apenas imagens, PDF, audio, video ou documentos comuns na campanha.";
messages.pt.translations.backendErrors.ERR_CAMPAIGN_NAME_REQUIRED =
  "Informe o nome da campanha.";
messages.pt.translations.backendErrors.ERR_CAMPAIGN_EMPTY =
  "Informe uma mensagem ou anexe um arquivo para a campanha.";
messages.pt.translations.backendErrors.ERR_CAMPAIGN_CONTACTS_REQUIRED =
  "Selecione ao menos um contato para a campanha.";
messages.pt.translations.backendErrors.ERR_CAMPAIGN_PAST_DATE =
  "Nao e possivel agendar campanha no passado.";
messages.pt.translations.backendErrors.ERR_CAMPAIGN_LIMIT_EXCEEDED =
  "A campanha excede o limite de 50 contatos por 24h desta conexao.";
messages.pt.translations.backendErrors.ERR_CAMPAIGN_INVALID_CONTACTS =
  "Alguns contatos selecionados para a campanha nao existem mais.";
messages.pt.translations.backendErrors.ERR_CAMPAIGN_CREATE_FAILED =
  "Nao foi possivel criar a campanha.";
messages.pt.translations.backendErrors.ERR_NO_CAMPAIGN_FOUND =
  "Nenhuma campanha encontrada com este ID.";
messages.pt.translations.backendErrors.ERR_CAMPAIGN_CANCEL_NOT_ALLOWED =
  "Somente campanhas em rascunho, agendadas ou processando podem ser canceladas.";
messages.pt.translations.backendErrors.ERR_FLOW_NAME_REQUIRED =
  "Informe o nome do fluxo.";
messages.pt.translations.backendErrors.ERR_FLOW_NODES_REQUIRED =
  "Adicione ao menos um passo ao fluxo.";
messages.pt.translations.backendErrors.ERR_FLOW_KEYWORD_REQUIRED =
  "Informe a palavra-chave do gatilho.";
messages.pt.translations.backendErrors.ERR_FLOW_INVALID_NODE =
  "O fluxo possui um tipo de passo invalido.";
messages.pt.translations.backendErrors.ERR_NO_FLOW_FOUND =
  "Nenhum fluxo encontrado com este ID.";

export { messages };
