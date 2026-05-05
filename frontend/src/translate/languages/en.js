const messages = {
  en: {
    translations: {
      signup: {
        title: "Sign up",
        toasts: {
          success: "User created successfully! Please login!",
          fail: "Error creating user. Check the reported data.",
        },
        form: {
          name: "Name",
          email: "Email",
          password: "Password",
        },
        buttons: {
          submit: "Register",
          login: "Already have an account? Log in!",
        },
      },
      login: {
        title: "Login",
        form: {
          email: "Email",
          password: "Password",
        },
        buttons: {
          submit: "Enter",
          register: "Don't have an account? Register!",
        },
      },
      auth: {
        toasts: {
          success: "Login successfully!",
        },
      },
      dashboard: {
        charts: {
          perDay: {
            title: "Tickets today: ",
          },
        },
        messages: {
          inAttendance: {
            title: "In Service"
          },
          waiting: {
            title: "Waiting"
          },
          closed: {
            title: "Closed"
          }
        }
      },
      connections: {
        title: "Connections",
        toasts: {
          deleted: "WhatsApp connection deleted sucessfully!",
        },
        confirmationModal: {
          deleteTitle: "Delete",
          deleteMessage: "Are you sure? It cannot be reverted.",
          disconnectTitle: "Disconnect",
          disconnectMessage: "Are you sure? You'll need to read QR Code again.",
        },
        buttons: {
          add: "Add WhatsApp",
          disconnect: "Disconnect",
          tryAgain: "Try Again",
          qrcode: "QR CODE",
          newQr: "New QR CODE",
          connecting: "Connectiing",
        },
        toolTips: {
          disconnected: {
            title: "Failed to start WhatsApp session",
            content:
              "Make sure your cell phone is connected to the internet and try again, or request a new QR Code",
          },
          qrcode: {
            title: "Waiting for QR Code read",
            content:
              "Click on 'QR CODE' button and read the QR Code with your cell phone to start session",
          },
          connected: {
            title: "Connection established",
          },
          timeout: {
            title: "Connection with cell phone has been lost",
            content:
              "Make sure your cell phone is connected to the internet and WhatsApp is open, or click on 'Disconnect' button to get a new QRcode",
          },
        },
        table: {
          name: "Name",
          status: "Status",
          lastUpdate: "Last Update",
          default: "Default",
          actions: "Actions",
          session: "Session",
        },
      },
      whatsappModal: {
        title: {
          add: "Add WhatsApp",
          edit: "Edit WhatsApp",
        },
        form: {
          name: "Name",
          default: "Default",
        },
        buttons: {
          okAdd: "Add",
          okEdit: "Save",
          cancel: "Cancel",
        },
        success: "WhatsApp saved successfully.",
      },
      qrCode: {
        message: "Read QrCode to start the session",
      },
      contacts: {
        title: "Contacts",
        toasts: {
          deleted: "Contact deleted sucessfully!",
        },
        searchPlaceholder: "Search ...",
        confirmationModal: {
          deleteTitle: "Delete",
          importTitlte: "Import contacts",
          deleteMessage:
            "Are you sure you want to delete this contact? All related tickets will be lost.",
          importMessage: "Do you want to import all contacts from the phone?",
        },
        buttons: {
          import: "Import Contacts",
          add: "Add Contact",
        },
        table: {
          name: "Name",
          whatsapp: "WhatsApp",
          email: "Email",
          actions: "Actions",
        },
      },
      contactModal: {
        title: {
          add: "Add contact",
          edit: "Edit contact",
        },
        form: {
          mainInfo: "Contact details",
          extraInfo: "Additional information",
          name: "Name",
          number: "Whatsapp number",
          email: "Email",
          extraName: "Field name",
          extraValue: "Value",
        },
        buttons: {
          addExtraInfo: "Add information",
          okAdd: "Add",
          okEdit: "Save",
          cancel: "Cancel",
        },
        success: "Contact saved successfully.",
      },
      quickAnswersModal: {
        title: {
          add: "Add Quick Reply",
          edit: "Edit Quick Answer",
        },
        form: {
          shortcut: "Shortcut",
          message: "Quick Reply",
        },
        buttons: {
          okAdd: "Add",
          okEdit: "Save",
          cancel: "Cancel",
        },
        success: "Quick Reply saved successfully.",
      },
      queueModal: {
        title: {
          add: "Add queue",
          edit: "Edit queue",
        },
        form: {
          name: "Name",
          color: "Color",
          greetingMessage: "Greeting Message",
        },
        buttons: {
          okAdd: "Add",
          okEdit: "Save",
          cancel: "Cancel",
        },
      },
      userModal: {
        title: {
          add: "Add user",
          edit: "Edit user",
        },
        form: {
          name: "Name",
          email: "Email",
          password: "Password",
          profile: "Profile",
          whatsapp: "Default Connection",
        },
        buttons: {
          okAdd: "Add",
          okEdit: "Save",
          cancel: "Cancel",
        },
        success: "User saved successfully.",
      },
      chat: {
        noTicketMessage: "Select a ticket to start chatting.",
      },
      ticketsManager: {
        buttons: {
          newTicket: "New",
        },
      },
      ticketsQueueSelect: {
        placeholder: "Queues",
      },
      tickets: {
        toasts: {
          deleted: "The ticket you were on has been deleted.",
        },
        notification: {
          message: "Message from",
        },
        tabs: {
          open: { title: "Inbox" },
          closed: { title: "Resolved" },
          search: { title: "Search" },
        },
        search: {
          placeholder: "Search tickets and messages.",
        },
        buttons: {
          showAll: "All",
        },
      },
      transferTicketModal: {
        title: "Transfer Ticket",
        fieldLabel: "Type to search for users",
        fieldQueueLabel: "Transfer to queue",
        fieldConnectionLabel: "Transfer to connection",
        fieldQueuePlaceholder: "Please select a queue",
        fieldConnectionPlaceholder: "Please select a connection",
        noOptions: "No user found with this name",
        buttons: {
          ok: "Transfer",
          cancel: "Cancel",
        },
      },
      ticketsList: {
        pendingHeader: "Queue",
        assignedHeader: "Working on",
        noTicketsTitle: "Nothing here!",
        noTicketsMessage: "No tickets found with this status or search term.",
        connectionTitle: "Connection that is currently being used.",
        buttons: {
          accept: "Accept",
        },
      },
      newTicketModal: {
        title: "Create Ticket",
        fieldLabel: "Type to search for a contact",
        add: "Add",
        buttons: {
          ok: "Save",
          cancel: "Cancel",
        },
      },
      mainDrawer: {
        listItems: {
          dashboard: "Dashboard",
          connections: "Connections",
          tickets: "Tickets",
          contacts: "Contacts",
          quickAnswers: "Quick Answers",
          queues: "Queues",
          administration: "Administration",
          users: "Users",
          settings: "Settings",
        },
        appBar: {
          user: {
            profile: "Profile",
            logout: "Logout",
          },
        },
      },
      notifications: {
        noTickets: "No notifications.",
      },
      queues: {
        title: "Queues",
        table: {
          name: "Name",
          color: "Color",
          greeting: "Greeting message",
          actions: "Actions",
        },
        buttons: {
          add: "Add queue",
        },
        confirmationModal: {
          deleteTitle: "Delete",
          deleteMessage:
            "Are you sure? It cannot be reverted! Tickets in this queue will still exist, but will not have any queues assigned.",
        },
      },
      queueSelect: {
        inputLabel: "Queues",
      },
      quickAnswers: {
        title: "Quick Answers",
        table: {
          shortcut: "Shortcut",
          message: "Quick Reply",
          actions: "Actions",
        },
        buttons: {
          add: "Add Quick Reply",
        },
        toasts: {
          deleted: "Quick Reply deleted successfully.",
        },
        searchPlaceholder: "Search...",
        confirmationModal: {
          deleteTitle: "Are you sure you want to delete this Quick Reply: ",
          deleteMessage: "This action cannot be undone.",
        },
      },
      users: {
        title: "Users",
        table: {
          name: "Name",
          email: "Email",
          profile: "Profile",
          whatsapp: "Default Connection",
          actions: "Actions",
        },
        buttons: {
          add: "Add user",
        },
        toasts: {
          deleted: "User deleted sucessfully.",
        },
        confirmationModal: {
          deleteTitle: "Delete",
          deleteMessage:
            "All user data will be lost. Users' open tickets will be moved to queue.",
        },
      },
      settings: {
        success: "Settings saved successfully.",
        title: "Settings",
        settings: {
          userCreation: {
            name: "User creation",
            options: {
              enabled: "Enabled",
              disabled: "Disabled",
            },
          },
        },
      },
      branding: {
        title: "Branding",
        description:
          "Set the logos, favicon, system name, colors and texts shown on the login screen and inside the system.",
        fields: {
          loginLogo: "Login screen logo",
          internalLogo: "Internal logo",
          favicon: "Favicon",
          systemName: "System name",
          pageTitle: "Page title",
          primaryColor: "Primary color",
          secondaryColor: "Secondary color",
          loginFooterText: "Login footer text",
          showLoginLogo: "Show logo on login screen",
          showInternalLogo: "Show logo in internal area",
        },
        buttons: {
          open: "Open Branding",
          selectLoginLogo: "Select login logo",
          selectInternalLogo: "Select internal logo",
          selectFavicon: "Select favicon",
          save: "Save",
          saving: "Saving...",
        },
        preview: {
          empty: "No file uploaded.",
          current: "Keeping current file.",
        },
        success: "Branding saved successfully.",
      },
      messagesList: {
        header: {
          assignedTo: "Assigned to:",
          buttons: {
            return: "Return",
            resolve: "Resolve",
            reopen: "Reopen",
            accept: "Accept",
          },
        },
      },
      messagesInput: {
        placeholderOpen: "Type a message or press ''/'' to use the registered quick responses",
        placeholderClosed: "Reopen or accept this ticket to send a message.",
        signMessage: "Sign",
      },
      contactDrawer: {
        header: "Contact details",
        buttons: {
          edit: "Edit contact",
        },
        extraInfo: "Other information",
      },
      ticketOptionsMenu: {
        delete: "Delete",
        transfer: "Transfer",
        scheduleMessage: "Schedule send",
        confirmationModal: {
          title: "Delete ticket #",
          titleFrom: "from contact ",
          message: "Attention! All ticket's related messages will be lost.",
        },
        buttons: {
          delete: "Delete",
          cancel: "Cancel",
        },
      },
      scheduleMessageModal: {
        title: "Schedule message send",
        contact: "Contact name",
        number: "Contact number",
        ticket: "Ticket ID",
        message: "Message",
        attachFile: "Attach file",
        selectedFile: "Selected file",
        connection: "Outgoing connection",
        selectConnection: "Select a connection",
        sendDate: "Send date",
        sendTime: "Send time",
        signMessage: "Sign message",
        cancel: "Cancel",
        confirm: "Schedule send",
        success: "Message scheduled successfully.",
        errors: {
          required: "Enter a message or attach a file.",
          connectionRequired: "Select which connection will send this message.",
          pastDate: "Choose a future date and time.",
        },
      },
      confirmationModal: {
        buttons: {
          confirm: "Ok",
          cancel: "Cancel",
        },
      },
      messageOptionsMenu: {
        delete: "Delete",
        reply: "Reply",
        confirmationModal: {
          title: "Delete message?",
          message: "This action cannot be reverted.",
        },
      },
      backendErrors: {
        ERR_NO_OTHER_WHATSAPP:
          "There must be at lest one default WhatsApp connection.",
        ERR_NO_DEF_WAPP_FOUND:
          "No default WhatsApp found. Check connections page.",
        ERR_WAPP_NOT_INITIALIZED:
          "This WhatsApp session is not initialized. Check connections page.",
        ERR_WAPP_CHECK_CONTACT:
          "Could not check WhatsApp contact. Check connections page.",
        ERR_WAPP_INVALID_CONTACT: "This is not a valid whatsapp number.",
        ERR_WAPP_DOWNLOAD_MEDIA:
          "Could not download media from WhatsApp. Check connections page.",
        ERR_INVALID_CREDENTIALS: "Authentication error. Please try again.",
        ERR_SENDING_WAPP_MSG:
          "Error sending WhatsApp message. Check connections page.",
        ERR_DELETE_WAPP_MSG: "Couldn't delete message from WhatsApp.",
        ERR_OTHER_OPEN_TICKET:
          "There's already an open ticket for this contact.",
        ERR_SESSION_EXPIRED: "Session expired. Please login.",
        ERR_USER_CREATION_DISABLED:
          "User creation was disabled by administrator.",
        ERR_NO_PERMISSION: "You don't have permission to access this resource.",
        ERR_DUPLICATED_CONTACT: "A contact with this number already exists.",
        ERR_NO_SETTING_FOUND: "No setting found with this ID.",
        ERR_NO_CONTACT_FOUND: "No contact found with this ID.",
        ERR_NO_TICKET_FOUND: "No ticket found with this ID.",
        ERR_NO_USER_FOUND: "No user found with this ID.",
        ERR_NO_WAPP_FOUND: "No WhatsApp found with this ID.",
        ERR_TICKET_NO_WHATSAPP:
          "This ticket does not have a linked WhatsApp connection.",
        ERR_SCHEDULED_MESSAGE_EMPTY:
          "Enter a message or attach a file before scheduling.",
        ERR_SCHEDULED_MESSAGE_DATE_REQUIRED:
          "A schedule date and time are required.",
        ERR_SCHEDULED_MESSAGE_INVALID_DATE:
          "The scheduled date is invalid.",
        ERR_SCHEDULED_MESSAGE_PAST_DATE:
          "You cannot schedule messages in the past.",
        ERR_SCHEDULED_MESSAGE_INVALID_TICKET_RELATION:
          "The provided ticket data does not match the current conversation.",
        ERR_NO_SCHEDULED_MESSAGE_FOUND:
          "No scheduled message found with this ID.",
        ERR_SCHEDULED_MESSAGE_CANCEL_NOT_ALLOWED:
          "Only pending scheduled messages can be canceled.",
        ERR_INVALID_BRANDING_MEDIA_TYPE:
          "Upload only PNG, JPG, JPEG, WEBP or ICO images for branding.",
        ERR_NO_BRANDING_FILE_SENT:
          "Select at least one branding file to upload.",
        ERR_BRANDING_INVALID_COLOR:
          "Enter valid hexadecimal colors.",
        ERR_CREATING_MESSAGE: "Error while creating message on database.",
        ERR_CREATING_TICKET: "Error while creating ticket on database.",
        ERR_FETCH_WAPP_MSG:
          "Error fetching the message in WhtasApp, maybe it is too old.",
        ERR_QUEUE_COLOR_ALREADY_EXISTS:
          "This color is already in use, pick another one.",
        ERR_WAPP_GREETING_REQUIRED:
          "Greeting message is required if there is more than one queue.",
      },
    },
  },
};

messages.en.translations.connections.importOldMessages =
  "Download phone messages";
messages.en.translations.connections.importOldMessagesDays =
  "Number of days to fetch";
messages.en.translations.connections.importOldMessagesHelp =
  "The system will try to import conversations available in WhatsApp Web within the selected period. Depending on WhatsApp, not all old history may be available.";
messages.en.translations.connections.manageDescription =
  "Manage connections, sessions, QR Code and WhatsApp synchronization.";
messages.en.translations.connections.importOldMessagesStatus =
  "Sync status";
messages.en.translations.connections.importOldMessagesNow =
  "Sync now";
messages.en.translations.connections.importOldMessagesRunning =
  "Sync in progress";
messages.en.translations.connections.importOldMessagesDone = "Completed";
messages.en.translations.connections.importOldMessagesFailed = "Failed";
messages.en.translations.connections.importOldMessagesPending = "Pending";
messages.en.translations.connections.importOldMessagesIdle = "Not started";
messages.en.translations.connections.importOldMessagesLastRun =
  "Last sync";
messages.en.translations.connections.importOldMessagesValidationDays =
  "Enter a number of days between 1 and 90.";
messages.en.translations.connections.importOldMessagesStarted =
  "Old messages sync started successfully.";
messages.en.translations.connections.importOldMessagesAlreadyRunning =
  "There is already a sync running for this connection.";
messages.en.translations.connections.provider = "Provider";
messages.en.translations.connections.evolutionInstance = "Evolution instance";
messages.en.translations.connections.evolutionInfo =
  "This connection uses an existing Evolution API instance and does not display a local QR Code.";
messages.en.translations.connections.evolutionInstanceRequired =
  "Provide the instance name registered in Evolution API.";
messages.en.translations.connections.importNotAvailableEvolution =
  "Old history import is not available for Evolution API connections.";
messages.en.translations.connections.providers = {
  wwebjs: "WhatsApp Web (QR Code)",
  whaileys: "Whaileys",
  evolution: "Evolution API"
};
messages.en.translations.connections.statusLabels = {
  connected: "Online",
  syncing: "Syncing",
  disconnected: "Offline"
};
messages.en.translations.connections.buttons.syncStatus = "Sync status";
messages.en.translations.connections.buttons.syncingStatus = "Syncing";
messages.en.translations.whatsappModal.form.provider = "Connection provider";
messages.en.translations.whatsappModal.form.evolutionInstanceName =
  "Evolution instance name";
messages.en.translations.whatsappModal.form.evolutionInfo =
  "When using Evolution API, WhaTicket does not generate a QR Code on this screen. The connection will use the informed Evolution instance.";
messages.en.translations.mainDrawer.listItems.attendance = "Attendance";
messages.en.translations.mainDrawer.listItems.settingsGroup = "Settings";
messages.en.translations.backendErrors.ERR_OLD_MESSAGES_IMPORT_INVALID_DAYS =
  "Enter a number of days between 1 and 90 for synchronization.";
messages.en.translations.backendErrors.ERR_OLD_MESSAGES_IMPORT_ALREADY_RUNNING =
  "There is already a sync running for this connection.";
messages.en.translations.backendErrors.ERR_OLD_MESSAGES_IMPORT_UNSUPPORTED =
  "Old messages sync is currently available only for wwebjs connections.";
messages.en.translations.mainDrawer.listItems.campaignsGroup = "Campaigns";
messages.en.translations.mainDrawer.listItems.automationsGroup = "Automations";
messages.en.translations.integrations = {
  title: "Integrations",
  description: "Configure N8N, ChatGPT and Evolution API safely.",
  open: "Open Integrations",
  save: "Save",
  saving: "Saving...",
  success: "Integrations saved successfully.",
  keepSecretHint: "Leave blank to keep the current secret.",
  n8n: {
    title: "N8N",
    active: "Enable N8N integration",
    baseUrl: "N8N base URL",
    webhookUrl: "Default webhook URL",
    secret: "Token or secret"
  },
  chatgpt: {
    title: "ChatGPT",
    active: "Enable ChatGPT",
    apiKey: "API Key",
    model: "Model",
    basePrompt: "Base prompt",
    temperature: "Temperature",
    maxTokens: "Max tokens",
    queues: "Allowed queues",
    suggestReply: "Suggest reply",
    summarize: "Summarize ticket",
    summaryTitle: "Conversation summary"
  },
  evolution: {
    title: "Evolution API",
    active: "Enable Evolution API",
    baseUrl: "Base URL",
    apiKey: "API Key",
    instance: "Default instance",
    useAsDefault: "Use Evolution as default",
    test: "Test connection",
    testing: "Testing...",
    testSuccess: "Evolution connection validated successfully."
  }
};
messages.en.translations.webhooks = {
  title: "Webhooks",
  description: "Manage generic webhooks and monitor deliveries.",
  open: "Open Webhooks",
  add: "New webhook",
  save: "Save",
  cancel: "Cancel",
  close: "Close",
  success: "Webhook saved successfully.",
  deleted: "Webhook removed successfully.",
  test: "Test",
  testSuccess: "Test delivery sent successfully.",
  dialogTitle: "Webhook",
  deleteConfirmTitle: "Remove webhook",
  deleteConfirmMessage: "Do you really want to remove this webhook?",
  logsTitle: "Webhook logs",
  fields: {
    name: "Name",
    url: "URL",
    secret: "Secret",
    events: "Events",
    active: "Active"
  },
  table: {
    name: "Name",
    url: "URL",
    events: "Events",
    status: "Last status",
    actions: "Actions"
  },
  logs: {
    event: "Event",
    status: "Status",
    error: "Error"
  },
  events: {
    ticket_created: "Ticket created",
    ticket_updated: "Ticket updated",
    ticket_closed: "Ticket closed",
    message_received: "Message received",
    message_sent: "Message sent",
    contact_created: "Contact created",
    whatsapp_connected: "WhatsApp connected",
    whatsapp_disconnected: "WhatsApp disconnected",
    campaign_sent: "Campaign sent"
  }
};
messages.en.translations.campaigns = {
  title: "Campaigns",
  add: "New campaign",
  newCampaign: "Create campaign",
  save: "Save campaign",
  saving: "Saving...",
  cancel: "Cancel",
  success: "Campaign created successfully.",
  canceled: "Campaign canceled successfully.",
  failed: "failures",
  cancelTitle: "Cancel campaign",
  cancelMessage: "Do you want to cancel this campaign?",
  limitInfo: "You can send to up to {{count}} contacts in the next 24h.",
  fields: {
    name: "Name",
    whatsapp: "WhatsApp connection",
    message: "Message",
    scheduledAt: "Schedule at",
    file: "Attachment",
    contacts: "Contacts",
    contactsPlaceholder: "Search and select contacts"
  },
  table: {
    name: "Name",
    whatsapp: "Connection",
    status: "Status",
    scheduledAt: "Schedule",
    results: "Results",
    actions: "Actions"
  }
};
messages.en.translations.flowbuilder = {
  title: "Flowbuilder",
  add: "New flow",
  save: "Save flow",
  cancel: "Cancel",
  success: "Flow saved successfully.",
  deleted: "Flow removed successfully.",
  active: "Active",
  inactive: "Inactive",
  dialogTitle: "Flow",
  deleteTitle: "Remove flow",
  deleteMessage: "Do you really want to remove this flow?",
  nodesTitle: "Flow steps",
  addStep: "Add step",
  removeStep: "Remove step",
  noNextStep: "No next step",
  step: "Step",
  fields: {
    name: "Name",
    description: "Description",
    keyword: "Keyword",
    active: "Flow active",
    nodeLabel: "Step title",
    nodeType: "Step type",
    message: "Message",
    conditionValue: "Text to match",
    queue: "Queue",
    webhookUrl: "Webhook URL",
    nextStep: "Next step",
    trueNext: "If true",
    falseNext: "If false"
  },
  nodeTypes: {
    send_message: "Send message",
    condition_contains: "Condition: contains text",
    transfer_queue: "Transfer to queue",
    close_ticket: "Close ticket",
    webhook: "Webhook"
  },
  table: {
    name: "Name",
    keyword: "Keyword",
    active: "Active",
    steps: "Steps",
    actions: "Actions"
  }
};
messages.en.translations.backendErrors.ERR_WEBHOOK_INVALID_URL =
  "Provide a valid webhook URL.";
messages.en.translations.backendErrors.ERR_WEBHOOK_INVALID_PAYLOAD =
  "Provide name, URL and at least one event for the webhook.";
messages.en.translations.backendErrors.ERR_NO_WEBHOOK_FOUND =
  "No webhook found with this ID.";
messages.en.translations.backendErrors.ERR_INTEGRATION_INVALID_URL =
  "Provide a valid integration URL.";
messages.en.translations.backendErrors.ERR_CHATGPT_NOT_CONFIGURED =
  "Configure and enable ChatGPT integration before using this feature.";
messages.en.translations.backendErrors.ERR_CHATGPT_QUEUE_NOT_ALLOWED =
  "This ticket queue is not allowed for ChatGPT.";
messages.en.translations.backendErrors.ERR_CHATGPT_REQUEST_FAILED =
  "Could not get a response from ChatGPT.";
messages.en.translations.backendErrors.ERR_CHATGPT_EMPTY_RESPONSE =
  "ChatGPT returned no usable content.";
messages.en.translations.backendErrors.ERR_CHATGPT_INVALID_TEMPERATURE =
  "Provide a temperature between 0 and 2.";
messages.en.translations.backendErrors.ERR_CHATGPT_INVALID_MAX_TOKENS =
  "Provide a max token value between 100 and 4000.";
messages.en.translations.backendErrors.ERR_EVOLUTION_INVALID_URL =
  "Provide a valid Evolution API URL.";
messages.en.translations.backendErrors.ERR_EVOLUTION_TEST_FAILED =
  "Failed to validate Evolution API connection.";
messages.en.translations.backendErrors.ERR_EVOLUTION_NOT_CONFIGURED =
  "Configure the Evolution API URL, API Key and instance before using this provider.";
messages.en.translations.backendErrors.ERR_EVOLUTION_INSTANCE_REQUIRED =
  "Provide the Evolution API instance name for this connection.";
messages.en.translations.backendErrors.ERR_EVOLUTION_WEBHOOK_UNAUTHORIZED =
  "Evolution API webhook rejected due to an invalid token.";
messages.en.translations.backendErrors.ERR_EVOLUTION_BACKEND_URL_NOT_CONFIGURED =
  "The public backend URL is not configured to register the Evolution webhook.";
messages.en.translations.backendErrors.ERR_INVALID_CAMPAIGN_MEDIA_TYPE =
  "Attach only images, PDF, audio, video or common documents in campaigns.";
messages.en.translations.backendErrors.ERR_CAMPAIGN_NAME_REQUIRED =
  "Provide the campaign name.";
messages.en.translations.backendErrors.ERR_CAMPAIGN_EMPTY =
  "Provide a message or attach a file for the campaign.";
messages.en.translations.backendErrors.ERR_CAMPAIGN_CONTACTS_REQUIRED =
  "Select at least one contact for the campaign.";
messages.en.translations.backendErrors.ERR_CAMPAIGN_PAST_DATE =
  "You cannot schedule a campaign in the past.";
messages.en.translations.backendErrors.ERR_CAMPAIGN_LIMIT_EXCEEDED =
  "The campaign exceeds the 50 contacts per 24h limit for this connection.";
messages.en.translations.backendErrors.ERR_CAMPAIGN_INVALID_CONTACTS =
  "Some selected contacts no longer exist.";
messages.en.translations.backendErrors.ERR_CAMPAIGN_CREATE_FAILED =
  "Could not create the campaign.";
messages.en.translations.backendErrors.ERR_NO_CAMPAIGN_FOUND =
  "No campaign found with this ID.";
messages.en.translations.backendErrors.ERR_CAMPAIGN_CANCEL_NOT_ALLOWED =
  "Only draft, scheduled or processing campaigns can be canceled.";
messages.en.translations.backendErrors.ERR_FLOW_NAME_REQUIRED =
  "Provide the flow name.";
messages.en.translations.backendErrors.ERR_FLOW_NODES_REQUIRED =
  "Add at least one step to the flow.";
messages.en.translations.backendErrors.ERR_FLOW_KEYWORD_REQUIRED =
  "Provide the trigger keyword.";
messages.en.translations.backendErrors.ERR_FLOW_INVALID_NODE =
  "The flow contains an invalid step type.";
messages.en.translations.backendErrors.ERR_NO_FLOW_FOUND =
  "No flow found with this ID.";

export { messages };
