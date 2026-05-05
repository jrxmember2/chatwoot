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
  HasMany
} from "sequelize-typescript";
import WebhookLog from "./WebhookLog";

@Table({ tableName: "webhooks" })
class Webhook extends Model<Webhook> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  url: string;

  @Column(DataType.TEXT)
  secret: string | null;

  @Column(DataType.TEXT)
  events: string;

  @Default(true)
  @Column
  isActive: boolean;

  @Column(DataType.INTEGER)
  lastStatus: number | null;

  @Column(DataType.TEXT)
  lastError: string | null;

  @Column(DataType.DATE(6))
  lastSentAt: Date | null;

  @HasMany(() => WebhookLog)
  logs: WebhookLog[];

  @CreatedAt
  @Column(DataType.DATE(6))
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE(6))
  updatedAt: Date;
}

export default Webhook;
