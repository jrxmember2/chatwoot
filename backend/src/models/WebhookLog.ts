import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";
import Webhook from "./Webhook";

@Table({ tableName: "webhook_logs" })
class WebhookLog extends Model<WebhookLog> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Webhook)
  @Column
  webhookId: number;

  @BelongsTo(() => Webhook)
  webhook: Webhook;

  @Column(DataType.STRING)
  event: string;

  @Column(DataType.TEXT)
  payload: string | null;

  @Column(DataType.INTEGER)
  statusCode: number | null;

  @Column(DataType.TEXT)
  responseBody: string | null;

  @Column(DataType.TEXT)
  error: string | null;

  @CreatedAt
  @Column(DataType.DATE(6))
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE(6))
  updatedAt: Date;
}

export default WebhookLog;
