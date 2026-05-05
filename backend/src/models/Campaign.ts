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
  BelongsTo,
  HasMany
} from "sequelize-typescript";
import Whatsapp from "./Whatsapp";
import User from "./User";
import CampaignContact from "./CampaignContact";

const buildPublicUrl = (relativePath: string | null): string | null => {
  if (!relativePath) {
    return null;
  }

  const backendUrl = (process.env.BACKEND_URL || "").replace(/\/$/, "");
  const proxyPort = process.env.PROXY_PORT;
  const shouldAppendPort =
    proxyPort &&
    proxyPort !== "80" &&
    proxyPort !== "443" &&
    !/:\d+$/.test(backendUrl);

  return `${backendUrl}${shouldAppendPort ? `:${proxyPort}` : ""}/public/${relativePath}`;
};

@Table({ tableName: "campaigns" })
class Campaign extends Model<Campaign> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column(DataType.STRING)
  name: string;

  @ForeignKey(() => Whatsapp)
  @Column
  whatsappId: number;

  @BelongsTo(() => Whatsapp)
  whatsapp: Whatsapp;

  @Column(DataType.TEXT)
  message: string | null;

  @Column(DataType.STRING)
  get mediaUrl(): string | null {
    return buildPublicUrl(this.getDataValue("mediaUrl"));
  }

  set mediaUrl(value: string | null) {
    this.setDataValue("mediaUrl", value);
  }

  @Column(DataType.STRING)
  mediaName: string | null;

  @Column(DataType.STRING)
  mediaType: string | null;

  @Column(DataType.STRING)
  status: string;

  @Column(DataType.DATE(6))
  scheduledAt: Date | null;

  @ForeignKey(() => User)
  @Column
  createdBy: number;

  @BelongsTo(() => User, "createdBy")
  creator: User;

  @HasMany(() => CampaignContact)
  contacts: CampaignContact[];

  @CreatedAt
  @Column(DataType.DATE(6))
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE(6))
  updatedAt: Date;
}

export default Campaign;
