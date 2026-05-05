import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  AllowNull,
  HasMany,
  Unique,
  BelongsToMany
} from "sequelize-typescript";
import Queue from "./Queue";
import Ticket from "./Ticket";
import WhatsappQueue from "./WhatsappQueue";
import WhatsAppHistoryImport from "./WhatsAppHistoryImport";
import Campaign from "./Campaign";

@Table
class Whatsapp extends Model<Whatsapp> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull
  @Unique
  @Column(DataType.TEXT)
  name: string;

  @Column(DataType.TEXT)
  session: string;

  @Column(DataType.TEXT)
  qrcode: string;

  @Column
  status: string;

  @Column
  battery: string;

  @Column
  plugged: boolean;

  @Column
  retries: number;

  @Column(DataType.TEXT)
  greetingMessage: string;

  @Column(DataType.TEXT)
  farewellMessage: string;

  @Default("wwebjs")
  @Column(DataType.STRING)
  provider: string;

  @Column(DataType.STRING)
  evolutionApiUrl: string | null;

  @Column(DataType.TEXT)
  evolutionApiKey: string | null;

  @Column(DataType.STRING)
  evolutionInstanceName: string | null;

  @Default(false)
  @Column
  importOldMessages: boolean;

  @Column(DataType.INTEGER)
  importOldMessagesDays: number | null;

  @Column(DataType.DATE(6))
  lastOldMessagesImportAt: Date | null;

  @Default("idle")
  @Column(DataType.STRING)
  oldMessagesImportStatus: string;

  @Column(DataType.TEXT)
  oldMessagesImportError: string | null;

  @Default(false)
  @AllowNull
  @Column
  isDefault: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => Ticket)
  tickets: Ticket[];

  @BelongsToMany(() => Queue, () => WhatsappQueue)
  queues: Array<Queue & { WhatsappQueue: WhatsappQueue }>;

  @HasMany(() => WhatsappQueue)
  whatsappQueues: WhatsappQueue[];

  @HasMany(() => WhatsAppHistoryImport)
  historyImports: WhatsAppHistoryImport[];

  @HasMany(() => Campaign)
  campaigns: Campaign[];
}

export default Whatsapp;
