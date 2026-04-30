import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default
} from "sequelize-typescript";

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

@Table({ tableName: "branding_settings" })
class BrandingSetting extends Model<BrandingSetting> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column(DataType.STRING)
  get loginLogoUrl(): string | null {
    return buildPublicUrl(this.getDataValue("loginLogoUrl"));
  }

  set loginLogoUrl(value: string | null) {
    this.setDataValue("loginLogoUrl", value);
  }

  @Column(DataType.STRING)
  get internalLogoUrl(): string | null {
    return buildPublicUrl(this.getDataValue("internalLogoUrl"));
  }

  set internalLogoUrl(value: string | null) {
    this.setDataValue("internalLogoUrl", value);
  }

  @Column(DataType.STRING)
  get faviconUrl(): string | null {
    return buildPublicUrl(this.getDataValue("faviconUrl"));
  }

  set faviconUrl(value: string | null) {
    this.setDataValue("faviconUrl", value);
  }

  @Default("WhaTicket")
  @Column(DataType.STRING)
  systemName: string;

  @Default("WhaTicket")
  @Column(DataType.STRING)
  pageTitle: string;

  @Default("#2576d2")
  @Column(DataType.STRING)
  primaryColor: string;

  @Default("#f50057")
  @Column(DataType.STRING)
  secondaryColor: string;

  @Column(DataType.TEXT)
  loginFooterText: string | null;

  @Default(true)
  @Column
  showLoginLogo: boolean;

  @Default(true)
  @Column
  showInternalLogo: boolean;

  @CreatedAt
  @Column(DataType.DATE(6))
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE(6))
  updatedAt: Date;
}

export default BrandingSetting;
