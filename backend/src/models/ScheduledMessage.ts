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
import Contact from "./Contact";
import Ticket from "./Ticket";
import User from "./User";
import Whatsapp from "./Whatsapp";

@Table({ tableName: "scheduled_messages" })
class ScheduledMessage extends Model<ScheduledMessage> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Ticket)
  @Column
  ticketId: number;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @ForeignKey(() => Contact)
  @Column
  contactId: number;

  @BelongsTo(() => Contact)
  contact: Contact;

  @ForeignKey(() => Whatsapp)
  @Column
  whatsappId: number;

  @BelongsTo(() => Whatsapp)
  whatsapp: Whatsapp;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column(DataType.TEXT)
  body: string | null;

  @Column(DataType.STRING)
  get mediaUrl(): string | null {
    const media = this.getDataValue("mediaUrl");

    if (media) {
      const backendUrl = (process.env.BACKEND_URL || "").replace(/\/$/, "");
      const proxyPort = process.env.PROXY_PORT;
      const shouldAppendPort =
        proxyPort &&
        proxyPort !== "80" &&
        proxyPort !== "443" &&
        !/:\d+$/.test(backendUrl);

      return `${backendUrl}${shouldAppendPort ? `:${proxyPort}` : ""}/public/${media}`;
    }

    return null;
  }

  set mediaUrl(value: string | null) {
    this.setDataValue("mediaUrl", value);
  }

  @Column
  mediaName: string | null;

  @Column
  mediaType: string | null;

  @Column(DataType.DATE(6))
  scheduledAt: Date;

  @Default("pending")
  @Column
  status: string;

  @Default(false)
  @Column
  signMessage: boolean;

  @Column(DataType.DATE(6))
  sentAt: Date | null;

  @Column(DataType.TEXT)
  error: string | null;

  @CreatedAt
  @Column(DataType.DATE(6))
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE(6))
  updatedAt: Date;
}

export default ScheduledMessage;
