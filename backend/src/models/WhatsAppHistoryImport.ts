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
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";
import Whatsapp from "./Whatsapp";

@Table({ tableName: "whatsapp_history_imports" })
class WhatsAppHistoryImport extends Model<WhatsAppHistoryImport> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Whatsapp)
  @Column
  whatsappId: number;

  @BelongsTo(() => Whatsapp)
  whatsapp: Whatsapp;

  @Default("pending")
  @Column(DataType.STRING)
  status: string;

  @Column(DataType.INTEGER)
  days: number;

  @Column(DataType.DATE(6))
  startedAt: Date | null;

  @Column(DataType.DATE(6))
  finishedAt: Date | null;

  @Default(0)
  @Column(DataType.INTEGER)
  importedChatsCount: number;

  @Default(0)
  @Column(DataType.INTEGER)
  importedMessagesCount: number;

  @Default(0)
  @Column(DataType.INTEGER)
  skippedMessagesCount: number;

  @Column(DataType.TEXT)
  error: string | null;

  @CreatedAt
  @Column(DataType.DATE(6))
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE(6))
  updatedAt: Date;
}

export default WhatsAppHistoryImport;
