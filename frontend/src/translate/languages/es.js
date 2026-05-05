const messages = {
  es: {
    translations: {
      signup: {
        title: "Registro",
        toasts: {
          success:
            "¡El usuario ha sido creado satisfactoriamente! ¡Ahora inicia sesión!",
          fail: "Error creando el usuario. Verifica la data reportada.",
        },
        form: {
          name: "Nombre",
          email: "Correo Electrónico",
          password: "Contraseña",
        },
        buttons: {
          submit: "Regístrate",
          login: "¿Ya tienes una cuenta? ¡Inicia sesión!",
        },
      },
      login: {
        title: "Inicio de Sesión",
        form: {
          email: "Correo Electrónico",
          password: "Contraseña",
        },
        buttons: {
          submit: "Ingresa",
          register: "¿No tienes cuenta? ¡Regístrate!",
        },
      },
      auth: {
        toasts: {
          success: "¡Inicio de sesión exitoso!",
        },
      },
      dashboard: {
        charts: {
          perDay: {
            title: "Tickets hoy: ",
          },
        },
        messages: {
          inAttendance: {
            title: "En servicio"
          },
          waiting: {
            title: "Esperando"
          },
          closed: {
            title: "Finalizado"
          }
        }
      },
      connections: {
        title: "Conexiones",
        toasts: {
          deleted:
            "¡La conexión de WhatsApp ha sido borrada satisfactoriamente!",
        },
        confirmationModal: {
          deleteTitle: "Borrar",
          deleteMessage: "¿Estás seguro? Este proceso no puede ser revertido.",
          disconnectTitle: "Desconectar",
          disconnectMessage: "Estás seguro? Deberá volver a leer el código QR",
        },
        buttons: {
          add: "Agrega WhatsApp",
          disconnect: "Desconectar",
          tryAgain: "Inténtalo de nuevo",
          qrcode: "QR CODE",
          newQr: "Nuevo QR CODE",
          connecting: "Conectando",
        },
        toolTips: {
          disconnected: {
            title: "No se pudo iniciar la sesión de WhatsApp",
            content:
              "Asegúrese de que su teléfono celular esté conectado a Internet y vuelva a intentarlo o solicite un nuevo código QR",
          },
          qrcode: {
            title: "Esperando la lectura del código QR",
            content:
              "Haga clic en el botón 'CÓDIGO QR' y lea el Código QR con su teléfono celular para iniciar la sesión",
          },
          connected: {
            title: "Conexión establecida",
          },
          timeout: {
            title: "Se perdió la conexión con el teléfono celular",
            content:
              "Asegúrese de que su teléfono celular esté conectado a Internet y que WhatsApp esté abierto, o haga clic en el botón 'Desconectar' para obtener un nuevo código QR",
          },
        },
        table: {
          name: "Nombre",
          status: "Estado",
          lastUpdate: "Última Actualización",
          default: "Por Defecto",
          actions: "Acciones",
          session: "Sesión",
        },
      },
      whatsappModal: {
        title: {
          add: "Agrega WhatsApp",
          edit: "Edita WhatsApp",
        },
        form: {
          name: "Nombre",
          default: "Por Defecto",
        },
        buttons: {
          okAdd: "Agregar",
          okEdit: "Guardar",
          cancel: "Cancelar",
        },
        success: "WhatsApp guardado satisfactoriamente.",
      },
      qrCode: {
        message: "Lée el código QR para empezar la sesión.",
      },
      contacts: {
        title: "Contactos",
        toasts: {
          deleted: "¡Contacto borrado satisfactoriamente!",
        },
        searchPlaceholder: "Buscar...",
        confirmationModal: {
          deleteTitle: "Borrar",
          importTitlte: "Importar contactos",
          deleteMessage:
            "¿Estás seguro que deseas borrar este contacto? Todos los tickets relacionados se perderán.",
          importMessage:
            "¿Quieres importar todos los contactos desde tu teléfono?",
        },
        buttons: {
          import: "Importar Contactos",
          add: "Agregar Contacto",
        },
        table: {
          name: "Nombre",
          whatsapp: "WhatsApp",
          email: "Correo Electrónico",
          actions: "Acciones",
        },
      },
      contactModal: {
        title: {
          add: "Agregar contacto",
          edit: "Editar contacto",
        },
        form: {
          mainInfo: "Detalles del contacto",
          extraInfo: "Información adicional",
          name: "Nombre",
          number: "Número de Whatsapp",
          email: "Correo Electrónico",
          extraName: "Nombre del Campo",
          extraValue: "Valor",
        },
        buttons: {
          addExtraInfo: "Agregar información",
          okAdd: "Agregar",
          okEdit: "Guardar",
          cancel: "Cancelar",
        },
        success: "Contacto guardado satisfactoriamente.",
      },
      quickAnswersModal: {
        title: {
          add: "Agregar respuesta rápida",
          edit: "Editar respuesta rápida",
        },
        form: {
          shortcut: "Atajo",
          message: "Respuesta rápida",
        },
        buttons: {
          okAdd: "Agregar",
          okEdit: "Guardar",
          cancel: "Cancelar",
        },
        success: "Respuesta rápida guardada correctamente.",
      },
      queueModal: {
        title: {
          add: "Agregar cola",
          edit: "Editar cola",
        },
        form: {
          name: "Nombre",
          color: "Color",
          greetingMessage: "Mensaje de saludo",
        },
        buttons: {
          okAdd: "Añadir",
          okEdit: "Ahorrar",
          cancel: "Cancelar",
        },
      },
      userModal: {
        title: {
          add: "Agregar usuario",
          edit: "Editar usuario",
        },
        form: {
          name: "Nombre",
          email: "Correo Electrónico",
          password: "Contraseña",
          profile: "Perfil",
          whatsapp: "Conexión estándar",
        },
        buttons: {
          okAdd: "Agregar",
          okEdit: "Guardar",
          cancel: "Cancelar",
        },
        success: "Usuario guardado satisfactoriamente.",
      },
      chat: {
        noTicketMessage: "Selecciona un ticket para empezar a chatear.",
      },
      ticketsManager: {
        buttons: {
          newTicket: "Nuevo",
        },
      },
      ticketsQueueSelect: {
        placeholder: "Linhas",
      },
      tickets: {
        toasts: {
          deleted: "El ticket en el que estabas ha sido borrado.",
        },
        notification: {
          message: "Mensaje de",
        },
        tabs: {
          open: { title: "Bandeja" },
          closed: { title: "Resueltos" },
          search: { title: "Buscar" },
        },
        search: {
          placeholder: "Buscar tickets y mensajes.",
        },
        buttons: {
          showAll: "Todos",
        },
      },
      transferTicketModal: {
        title: "Transferir Ticket",
        fieldLabel: "Escriba para buscar usuarios",
        fieldQueueLabel: "Transferir a la cola",
        fieldConnectionLabel: "Transferir to conexión",
        fieldQueuePlaceholder: "Seleccione una cola",
        fieldConnectionPlaceholder: "Seleccione una conexión",
        noOptions: "No se encontraron usuarios con ese nombre",
        buttons: {
          ok: "Transferir",
          cancel: "Cancelar",
        },
      },
      ticketsList: {
        pendingHeader: "Cola",
        assignedHeader: "Trabajando en",
        noTicketsTitle: "¡Nada acá!",
        connectionTitle: "Conexión que se está utilizando actualmente.",
        noTicketsMessage:
          "No se encontraron tickets con este estado o término de búsqueda",
        buttons: {
          accept: "Acceptar",
        },
      },
      newTicketModal: {
        title: "Crear Ticket",
        fieldLabel: "Escribe para buscar un contacto",
        add: "Añadir",
        buttons: {
          ok: "Guardar",
          cancel: "Cancelar",
        },
      },
      mainDrawer: {
        listItems: {
          dashboard: "Dashboard",
          connections: "Conexiones",
          tickets: "Tickets",
          contacts: "Contactos",
          quickAnswers: "Respuestas rápidas",
          queues: "Linhas",
          administration: "Administración",
          users: "Usuarios",
          settings: "Configuración",
        },
        appBar: {
          user: {
            profile: "Perfil",
            logout: "Cerrar Sesión",
          },
        },
      },
      notifications: {
        noTickets: "Sin notificaciones.",
      },
      queues: {
        title: "Linhas",
        table: {
          name: "Nombre",
          color: "Color",
          greeting: "Mensaje de saludo",
          actions: "Comportamiento",
        },
        buttons: {
          add: "Agregar cola",
        },
        confirmationModal: {
          deleteTitle: "Eliminar",
          deleteMessage:
            "¿Estás seguro? ¡Esta acción no se puede revertir! Los tickets en esa cola seguirán existiendo, pero ya no tendrán ninguna cola asignada.",
        },
      },
      queueSelect: {
        inputLabel: "Linhas",
      },
      quickAnswers: {
        title: "Respuestas rápidas",
        table: {
          shortcut: "Atajo",
          message: "Respuesta rápida",
          actions: "Acciones",
        },
        buttons: {
          add: "Agregar respuesta rápida",
        },
        toasts: {
          deleted: "Respuesta rápida eliminada correctamente",
        },
        searchPlaceholder: "Buscar ...",
        confirmationModal: {
          deleteTitle:
            "¿Está seguro de que desea eliminar esta respuesta rápida?",
          deleteMessage: "Esta acción no se puede deshacer.",
        },
      },
      users: {
        title: "Usuarios",
        table: {
          name: "Nombre",
          email: "Correo Electrónico",
          profile: "Perfil",
          whatsapp: "Conexión estándar",
          actions: "Acciones",
        },
        buttons: {
          add: "Agregar usuario",
        },
        toasts: {
          deleted: "Usuario borrado satisfactoriamente.",
        },
        confirmationModal: {
          deleteTitle: "Borrar",
          deleteMessage:
            "Toda la información del usuario se perderá. Los tickets abiertos de los usuarios se moverán a la cola.",
        },
      },
      settings: {
        success: "Configuración guardada satisfactoriamente.",
        title: "Configuración",
        settings: {
          userCreation: {
            name: "Creación de usuarios",
            options: {
              enabled: "Habilitado",
              disabled: "Deshabilitado",
            },
          },
        },
      },
      branding: {
        title: "Branding",
        description:
          "Define logos, favicon, nombre del sistema, colores y textos mostrados en el login y en el area interna.",
        fields: {
          loginLogo: "Logo de la pantalla de login",
          internalLogo: "Logo interna",
          favicon: "Favicon",
          systemName: "Nombre del sistema",
          pageTitle: "Titulo de la pagina",
          primaryColor: "Color primario",
          secondaryColor: "Color secundario",
          loginFooterText: "Texto del pie del login",
          showLoginLogo: "Mostrar logo en la pantalla de login",
          showInternalLogo: "Mostrar logo en el area interna",
        },
        buttons: {
          open: "Abrir Branding",
          selectLoginLogo: "Seleccionar logo del login",
          selectInternalLogo: "Seleccionar logo interna",
          selectFavicon: "Seleccionar favicon",
          save: "Guardar",
          saving: "Guardando...",
        },
        preview: {
          empty: "Ningun archivo enviado.",
          current: "Manteniendo archivo actual.",
        },
        success: "Branding guardado con exito.",
      },
      messagesList: {
        header: {
          assignedTo: "Asignado a:",
          buttons: {
            return: "Devolver",
            resolve: "Resolver",
            reopen: "Reabrir",
            accept: "Aceptar",
          },
        },
      },
      messagesInput: {
        placeholderOpen: "Escriba un mensaje o presione '' / '' para usar las respuestas rápidas registradas",
        placeholderClosed:
          "Vuelva a abrir o acepte este ticket para enviar un mensaje.",
        signMessage: "Firmar",
      },
      contactDrawer: {
        header: "Detalles del contacto",
        buttons: {
          edit: "Editar contacto",
        },
        extraInfo: "Otra información",
      },
      ticketOptionsMenu: {
        delete: "Borrar",
        transfer: "Transferir",
        scheduleMessage: "Programar envio",
        confirmationModal: {
          title: "¿Borrar ticket #",
          titleFrom: "del contacto ",
          message:
            "¡Atención! Todos los mensajes Todos los mensajes relacionados con el ticket se perderán.",
        },
        buttons: {
          delete: "Borrar",
          cancel: "Cancelar",
        },
      },
      scheduleMessageModal: {
        title: "Programar envio de mensaje",
        contact: "Nombre del contacto",
        number: "Numero del contacto",
        ticket: "ID del ticket",
        message: "Mensaje",
        attachFile: "Adjuntar archivo",
        selectedFile: "Archivo seleccionado",
        connection: "Conexion de salida",
        selectConnection: "Seleccione una conexion",
        sendDate: "Fecha del envio",
        sendTime: "Hora del envio",
        signMessage: "Firmar mensaje",
        cancel: "Cancelar",
        confirm: "Programar envio",
        success: "Mensaje programado correctamente.",
        errors: {
          required: "Ingresa un mensaje o adjunta un archivo.",
          connectionRequired: "Selecciona por cual conexion se enviara el mensaje.",
          pastDate: "Elige una fecha y hora futuras.",
        },
      },
      confirmationModal: {
        buttons: {
          confirm: "Ok",
          cancel: "Cancelar",
        },
      },
      messageOptionsMenu: {
        delete: "Borrar",
        reply: "Responder",
        confirmationModal: {
          title: "¿Borrar mensaje?",
          message: "Esta acción no puede ser revertida.",
        },
      },
      backendErrors: {
        ERR_NO_OTHER_WHATSAPP:
          "Debe haber al menos una conexión de WhatsApp predeterminada.",
        ERR_NO_DEF_WAPP_FOUND:
          "No se encontró WhatsApp predeterminado. Verifique la página de conexiones.",
        ERR_WAPP_NOT_INITIALIZED:
          "Esta sesión de WhatsApp no ​​está inicializada. Verifique la página de conexiones.",
        ERR_WAPP_CHECK_CONTACT:
          "No se pudo verificar el contacto de WhatsApp. Verifique la página de conexiones.",
        ERR_WAPP_INVALID_CONTACT: "Este no es un número de whatsapp válido.",
        ERR_WAPP_DOWNLOAD_MEDIA:
          "No se pudieron descargar los medios de WhatsApp. Verifique la página de conexiones.",
        ERR_INVALID_CREDENTIALS: "Error de autenticación. Vuelva a intentarlo.",
        ERR_SENDING_WAPP_MSG:
          "Error al enviar el mensaje de WhatsApp. Verifique la página de conexiones.",
        ERR_DELETE_WAPP_MSG: "No se pudo borrar el mensaje de WhatsApp.",
        ERR_OTHER_OPEN_TICKET: "Ya hay un ticket abierto para este contacto.",
        ERR_SESSION_EXPIRED: "Sesión caducada. Inicie sesión.",
        ERR_USER_CREATION_DISABLED:
          "La creación de usuarios fue deshabilitada por el administrador.",
        ERR_NO_PERMISSION: "No tienes permiso para acceder a este recurso.",
        ERR_DUPLICATED_CONTACT: "Ya existe un contacto con este número.",
        ERR_NO_SETTING_FOUND:
          "No se encontró ninguna configuración con este ID.",
        ERR_NO_CONTACT_FOUND: "No se encontró ningún contacto con este ID.",
        ERR_NO_TICKET_FOUND: "No se encontró ningún ticket con este ID.",
        ERR_NO_USER_FOUND: "No se encontró ningún usuario con este ID.",
        ERR_NO_WAPP_FOUND: "No se encontró WhatsApp con este ID.",
        ERR_TICKET_NO_WHATSAPP:
          "Este ticket no tiene una conexion de WhatsApp vinculada.",
        ERR_SCHEDULED_MESSAGE_EMPTY:
          "Ingresa un mensaje o adjunta un archivo antes de programar.",
        ERR_SCHEDULED_MESSAGE_DATE_REQUIRED:
          "La fecha y hora del envio son obligatorias.",
        ERR_SCHEDULED_MESSAGE_INVALID_DATE:
          "La fecha informada para el envio no es valida.",
        ERR_SCHEDULED_MESSAGE_PAST_DATE:
          "No es posible programar mensajes en el pasado.",
        ERR_SCHEDULED_MESSAGE_INVALID_TICKET_RELATION:
          "Los datos del ticket no coinciden con la conversacion actual.",
        ERR_NO_SCHEDULED_MESSAGE_FOUND:
          "No se encontro ningun agendamiento con este ID.",
        ERR_SCHEDULED_MESSAGE_CANCEL_NOT_ALLOWED:
          "Solo se pueden cancelar agendamientos pendientes.",
        ERR_INVALID_BRANDING_MEDIA_TYPE:
          "Sube solo imagenes PNG, JPG, JPEG, WEBP o ICO para el branding.",
        ERR_NO_BRANDING_FILE_SENT:
          "Selecciona al menos un archivo de branding para subir.",
        ERR_BRANDING_INVALID_COLOR:
          "Informa colores validos en formato hexadecimal.",
        ERR_CREATING_MESSAGE: "Error al crear el mensaje en la base de datos.",
        ERR_CREATING_TICKET: "Error al crear el ticket en la base de datos.",
        ERR_FETCH_WAPP_MSG:
          "Error al obtener el mensaje en WhtasApp, tal vez sea demasiado antiguo.",
        ERR_QUEUE_COLOR_ALREADY_EXISTS:
          "Este color ya está en uso, elija otro.",
        ERR_WAPP_GREETING_REQUIRED:
          "El mensaje de saludo es obligatorio cuando hay más de una cola.",
      },
    },
  },
};

messages.es.translations.connections.importOldMessages =
  "Bajar mensajes del celular";
messages.es.translations.connections.importOldMessagesDays =
  "Cantidad de dias para buscar";
messages.es.translations.connections.importOldMessagesHelp =
  "El sistema intentara importar las conversaciones disponibles en WhatsApp Web dentro del periodo informado. Dependiendo de WhatsApp, no todo el historial antiguo puede estar disponible.";
messages.es.translations.connections.manageDescription =
  "Administra conexiones, sesiones, QR Code y sincronizacion de WhatsApp.";
messages.es.translations.connections.importOldMessagesStatus =
  "Estado de la sincronizacion";
messages.es.translations.connections.importOldMessagesNow =
  "Sincronizar ahora";
messages.es.translations.connections.importOldMessagesRunning =
  "Sincronizacion en curso";
messages.es.translations.connections.importOldMessagesDone = "Concluido";
messages.es.translations.connections.importOldMessagesFailed = "Fallo";
messages.es.translations.connections.importOldMessagesPending = "Pendiente";
messages.es.translations.connections.importOldMessagesIdle = "No iniciado";
messages.es.translations.connections.importOldMessagesLastRun =
  "Ultima sincronizacion";
messages.es.translations.connections.importOldMessagesValidationDays =
  "Informa una cantidad de dias entre 1 y 90.";
messages.es.translations.connections.importOldMessagesStarted =
  "La sincronizacion de mensajes antiguos fue iniciada con exito.";
messages.es.translations.connections.importOldMessagesAlreadyRunning =
  "Ya existe una sincronizacion en curso para esta conexion.";
messages.es.translations.connections.provider = "Proveedor";
messages.es.translations.connections.evolutionInstance = "Instancia Evolution";
messages.es.translations.connections.evolutionInfo =
  "Esta conexion usa una instancia existente de Evolution API y no muestra un QR Code local.";
messages.es.translations.connections.evolutionInstanceRequired =
  "Informa el nombre de la instancia registrada en Evolution API.";
messages.es.translations.connections.importNotAvailableEvolution =
  "La importacion de historial antiguo no esta disponible para conexiones Evolution API.";
messages.es.translations.connections.providers = {
  wwebjs: "WhatsApp Web (QR Code)",
  whaileys: "Whaileys",
  evolution: "Evolution API"
};
messages.es.translations.connections.statusLabels = {
  connected: "Online",
  syncing: "Sincronizando",
  disconnected: "Offline"
};
messages.es.translations.connections.buttons.syncStatus = "Sincronizar";
messages.es.translations.connections.buttons.syncingStatus = "Sincronizando";
messages.es.translations.whatsappModal.form.provider = "Proveedor de la conexion";
messages.es.translations.whatsappModal.form.evolutionInstanceName =
  "Nombre de la instancia en Evolution";
messages.es.translations.whatsappModal.form.evolutionInfo =
  "Al usar Evolution API, WhaTicket no genera un QR Code en esta pantalla. La conexion pasara a usar la instancia informada en Evolution.";
messages.es.translations.mainDrawer.listItems.attendance = "Atencion";
messages.es.translations.mainDrawer.listItems.settingsGroup =
  "Configuracion";
messages.es.translations.backendErrors.ERR_OLD_MESSAGES_IMPORT_INVALID_DAYS =
  "Informa una cantidad de dias entre 1 y 90 para la sincronizacion.";
messages.es.translations.backendErrors.ERR_OLD_MESSAGES_IMPORT_ALREADY_RUNNING =
  "Ya existe una sincronizacion en curso para esta conexion.";
messages.es.translations.backendErrors.ERR_OLD_MESSAGES_IMPORT_UNSUPPORTED =
  "La sincronizacion de mensajes antiguos esta disponible solo para conexiones wwebjs.";
messages.es.translations.mainDrawer.listItems.campaignsGroup = "Campanas";
messages.es.translations.mainDrawer.listItems.automationsGroup = "Automatizaciones";
messages.es.translations.integrations = {
  title: "Integraciones",
  description: "Configura N8N, ChatGPT y Evolution API de forma segura.",
  open: "Abrir Integraciones",
  save: "Guardar",
  saving: "Guardando...",
  success: "Integraciones guardadas con exito.",
  keepSecretHint: "Deja vacio para mantener el secreto actual.",
  n8n: {
    title: "N8N",
    active: "Activar integracion con N8N",
    baseUrl: "URL base de N8N",
    webhookUrl: "Webhook por defecto",
    secret: "Token o secret"
  },
  chatgpt: {
    title: "ChatGPT",
    active: "Activar ChatGPT",
    apiKey: "API Key",
    model: "Modelo",
    basePrompt: "Prompt base",
    temperature: "Temperatura",
    maxTokens: "Limite de tokens",
    queues: "Colas permitidas",
    suggestReply: "Sugerir respuesta",
    summarize: "Resumir conversacion",
    summaryTitle: "Resumen de la conversacion"
  },
  evolution: {
    title: "Evolution API",
    active: "Activar Evolution API",
    baseUrl: "URL base",
    apiKey: "API Key",
    instance: "Instancia por defecto",
    useAsDefault: "Usar Evolution por defecto",
    test: "Probar conexion",
    testing: "Probando...",
    testSuccess: "Conexion con Evolution validada correctamente."
  }
};
messages.es.translations.webhooks = {
  title: "Webhooks",
  description: "Administra webhooks genericos y revisa los envios.",
  open: "Abrir Webhooks",
  add: "Nuevo webhook",
  save: "Guardar",
  cancel: "Cancelar",
  close: "Cerrar",
  success: "Webhook guardado con exito.",
  deleted: "Webhook eliminado con exito.",
  test: "Probar",
  testSuccess: "Envio de prueba realizado.",
  dialogTitle: "Webhook",
  deleteConfirmTitle: "Eliminar webhook",
  deleteConfirmMessage: "Deseas eliminar este webhook?",
  logsTitle: "Logs del webhook",
  fields: {
    name: "Nombre",
    url: "URL",
    secret: "Secret",
    events: "Eventos",
    active: "Activo"
  },
  table: {
    name: "Nombre",
    url: "URL",
    events: "Eventos",
    status: "Ultimo estado",
    actions: "Acciones"
  },
  logs: {
    event: "Evento",
    status: "Estado",
    error: "Error"
  },
  events: {
    ticket_created: "Ticket creado",
    ticket_updated: "Ticket actualizado",
    ticket_closed: "Ticket cerrado",
    message_received: "Mensaje recibido",
    message_sent: "Mensaje enviado",
    contact_created: "Contacto creado",
    whatsapp_connected: "WhatsApp conectado",
    whatsapp_disconnected: "WhatsApp desconectado",
    campaign_sent: "Campana enviada"
  }
};
messages.es.translations.campaigns = {
  title: "Campanas",
  add: "Nueva campana",
  newCampaign: "Crear campana",
  save: "Guardar campana",
  saving: "Guardando...",
  cancel: "Cancelar",
  success: "Campana creada con exito.",
  canceled: "Campana cancelada con exito.",
  failed: "fallos",
  cancelTitle: "Cancelar campana",
  cancelMessage: "Deseas cancelar esta campana?",
  limitInfo: "Puedes enviar a hasta {{count}} contactos en las proximas 24h.",
  fields: {
    name: "Nombre",
    whatsapp: "Conexion WhatsApp",
    message: "Mensaje",
    scheduledAt: "Programar para",
    file: "Adjunto",
    contacts: "Contactos",
    contactsPlaceholder: "Busca y selecciona contactos"
  },
  table: {
    name: "Nombre",
    whatsapp: "Conexion",
    status: "Estado",
    scheduledAt: "Programacion",
    results: "Resultados",
    actions: "Acciones"
  }
};
messages.es.translations.flowbuilder = {
  title: "Flowbuilder",
  add: "Nuevo flujo",
  save: "Guardar flujo",
  cancel: "Cancelar",
  success: "Flujo guardado con exito.",
  deleted: "Flujo eliminado con exito.",
  active: "Activo",
  inactive: "Inactivo",
  dialogTitle: "Flujo",
  deleteTitle: "Eliminar flujo",
  deleteMessage: "Deseas eliminar este flujo?",
  nodesTitle: "Pasos del flujo",
  addStep: "Agregar paso",
  removeStep: "Eliminar paso",
  noNextStep: "Sin siguiente paso",
  step: "Paso",
  fields: {
    name: "Nombre",
    description: "Descripcion",
    keyword: "Palabra clave",
    active: "Flujo activo",
    nodeLabel: "Titulo del paso",
    nodeType: "Tipo de paso",
    message: "Mensaje",
    conditionValue: "Texto a verificar",
    queue: "Cola",
    webhookUrl: "URL del webhook",
    nextStep: "Siguiente paso",
    trueNext: "Si es verdadero",
    falseNext: "Si es falso"
  },
  nodeTypes: {
    send_message: "Enviar mensaje",
    condition_contains: "Condicion: contiene texto",
    transfer_queue: "Transferir a cola",
    close_ticket: "Cerrar ticket",
    webhook: "Webhook"
  },
  table: {
    name: "Nombre",
    keyword: "Palabra clave",
    active: "Activo",
    steps: "Pasos",
    actions: "Acciones"
  }
};
messages.es.translations.backendErrors.ERR_WEBHOOK_INVALID_URL =
  "Ingresa una URL valida para el webhook.";
messages.es.translations.backendErrors.ERR_WEBHOOK_INVALID_PAYLOAD =
  "Completa nombre, URL y al menos un evento para el webhook.";
messages.es.translations.backendErrors.ERR_NO_WEBHOOK_FOUND =
  "No se encontro un webhook con este ID.";
messages.es.translations.backendErrors.ERR_INTEGRATION_INVALID_URL =
  "Ingresa una URL valida para la integracion.";
messages.es.translations.backendErrors.ERR_CHATGPT_NOT_CONFIGURED =
  "Configura y activa ChatGPT antes de usar esta funcion.";
messages.es.translations.backendErrors.ERR_CHATGPT_QUEUE_NOT_ALLOWED =
  "La cola de este ticket no esta habilitada para ChatGPT.";
messages.es.translations.backendErrors.ERR_CHATGPT_REQUEST_FAILED =
  "No fue posible obtener respuesta de ChatGPT.";
messages.es.translations.backendErrors.ERR_CHATGPT_EMPTY_RESPONSE =
  "ChatGPT no devolvio contenido util.";
messages.es.translations.backendErrors.ERR_CHATGPT_INVALID_TEMPERATURE =
  "Ingresa una temperatura entre 0 y 2.";
messages.es.translations.backendErrors.ERR_CHATGPT_INVALID_MAX_TOKENS =
  "Ingresa un limite de tokens entre 100 y 4000.";
messages.es.translations.backendErrors.ERR_EVOLUTION_INVALID_URL =
  "Ingresa una URL valida para Evolution API.";
messages.es.translations.backendErrors.ERR_EVOLUTION_TEST_FAILED =
  "No se pudo validar la conexion con Evolution API.";
messages.es.translations.backendErrors.ERR_EVOLUTION_NOT_CONFIGURED =
  "Configura la URL, API Key e instancia de Evolution API antes de usar este proveedor.";
messages.es.translations.backendErrors.ERR_EVOLUTION_INSTANCE_REQUIRED =
  "Ingresa el nombre de la instancia de Evolution API para esta conexion.";
messages.es.translations.backendErrors.ERR_EVOLUTION_WEBHOOK_UNAUTHORIZED =
  "El webhook de Evolution API fue rechazado por token invalido.";
messages.es.translations.backendErrors.ERR_EVOLUTION_BACKEND_URL_NOT_CONFIGURED =
  "La URL publica del backend no esta configurada para registrar el webhook de Evolution.";
messages.es.translations.backendErrors.ERR_INVALID_CAMPAIGN_MEDIA_TYPE =
  "Adjunta solo imagenes, PDF, audio, video o documentos comunes en la campana.";
messages.es.translations.backendErrors.ERR_CAMPAIGN_NAME_REQUIRED =
  "Ingresa el nombre de la campana.";
messages.es.translations.backendErrors.ERR_CAMPAIGN_EMPTY =
  "Ingresa un mensaje o adjunta un archivo para la campana.";
messages.es.translations.backendErrors.ERR_CAMPAIGN_CONTACTS_REQUIRED =
  "Selecciona al menos un contacto para la campana.";
messages.es.translations.backendErrors.ERR_CAMPAIGN_PAST_DATE =
  "No es posible programar una campana en el pasado.";
messages.es.translations.backendErrors.ERR_CAMPAIGN_LIMIT_EXCEEDED =
  "La campana supera el limite de 50 contactos por 24h para esta conexion.";
messages.es.translations.backendErrors.ERR_CAMPAIGN_INVALID_CONTACTS =
  "Algunos contactos seleccionados ya no existen.";
messages.es.translations.backendErrors.ERR_CAMPAIGN_CREATE_FAILED =
  "No fue posible crear la campana.";
messages.es.translations.backendErrors.ERR_NO_CAMPAIGN_FOUND =
  "No se encontro una campana con este ID.";
messages.es.translations.backendErrors.ERR_CAMPAIGN_CANCEL_NOT_ALLOWED =
  "Solo las campanas borrador, programadas o procesando pueden cancelarse.";
messages.es.translations.backendErrors.ERR_FLOW_NAME_REQUIRED =
  "Ingresa el nombre del flujo.";
messages.es.translations.backendErrors.ERR_FLOW_NODES_REQUIRED =
  "Agrega al menos un paso al flujo.";
messages.es.translations.backendErrors.ERR_FLOW_KEYWORD_REQUIRED =
  "Ingresa la palabra clave del disparador.";
messages.es.translations.backendErrors.ERR_FLOW_INVALID_NODE =
  "El flujo contiene un tipo de paso invalido.";
messages.es.translations.backendErrors.ERR_NO_FLOW_FOUND =
  "No se encontro un flujo con este ID.";

export { messages };
