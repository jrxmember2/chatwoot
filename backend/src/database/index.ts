import { Sequelize } from "sequelize-typescript";
import User from "../models/User";
import Setting from "../models/Setting";
import Contact from "../models/Contact";
import Ticket from "../models/Ticket";
import Whatsapp from "../models/Whatsapp";
import ContactCustomField from "../models/ContactCustomField";
import Message from "../models/Message";
import Queue from "../models/Queue";
import WhatsappQueue from "../models/WhatsappQueue";
import UserQueue from "../models/UserQueue";
import QuickAnswer from "../models/QuickAnswer";
import WppKey from "../models/WppKey";
import ScheduledMessage from "../models/ScheduledMessage";
import BrandingSetting from "../models/BrandingSetting";
import WhatsAppHistoryImport from "../models/WhatsAppHistoryImport";
import IntegrationSetting from "../models/IntegrationSetting";
import Webhook from "../models/Webhook";
import WebhookLog from "../models/WebhookLog";
import Flow from "../models/Flow";
import FlowNode from "../models/FlowNode";
import FlowEdge from "../models/FlowEdge";
import FlowExecutionLog from "../models/FlowExecutionLog";
import Campaign from "../models/Campaign";
import CampaignContact from "../models/CampaignContact";
import CampaignDailyLimit from "../models/CampaignDailyLimit";

// eslint-disable-next-line
const dbConfig = require("../config/database");
// import dbConfig from "../config/database";

const sequelize = new Sequelize(dbConfig);

const models = [
  User,
  Contact,
  Ticket,
  Message,
  Whatsapp,
  ContactCustomField,
  Setting,
  Queue,
  WhatsappQueue,
  UserQueue,
  QuickAnswer,
  WppKey,
  ScheduledMessage,
  BrandingSetting,
  WhatsAppHistoryImport,
  IntegrationSetting,
  Webhook,
  WebhookLog,
  Flow,
  FlowNode,
  FlowEdge,
  FlowExecutionLog,
  Campaign,
  CampaignContact,
  CampaignDailyLimit
];

sequelize.addModels(models);

export default sequelize;
