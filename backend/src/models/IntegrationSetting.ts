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

@Table({ tableName: "integration_settings" })
class IntegrationSetting extends Model<IntegrationSetting> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Default(false)
  @Column
  n8nActive: boolean;

  @Column(DataType.STRING)
  n8nBaseUrl: string | null;

  @Column(DataType.STRING)
  n8nWebhookUrl: string | null;

  @Column(DataType.TEXT)
  n8nSecret: string | null;

  @Default(false)
  @Column
  chatgptActive: boolean;

  @Column(DataType.TEXT)
  chatgptApiKey: string | null;

  @Default("gpt-4.1-mini")
  @Column(DataType.STRING)
  chatgptModel: string;

  @Column(DataType.TEXT)
  chatgptBasePrompt: string | null;

  @Default(0.7)
  @Column(DataType.FLOAT)
  chatgptTemperature: number;

  @Default(500)
  @Column(DataType.INTEGER)
  chatgptMaxTokens: number;

  @Column(DataType.TEXT)
  chatgptQueueIds: string | null;

  @Default(false)
  @Column
  evolutionActive: boolean;

  @Column(DataType.STRING)
  evolutionBaseUrl: string | null;

  @Column(DataType.TEXT)
  evolutionApiKey: string | null;

  @Column(DataType.STRING)
  evolutionDefaultInstance: string | null;

  @Default(false)
  @Column
  evolutionUseAsDefault: boolean;

  @CreatedAt
  @Column(DataType.DATE(6))
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE(6))
  updatedAt: Date;
}

export default IntegrationSetting;
