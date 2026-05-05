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
import FlowNode from "./FlowNode";
import FlowEdge from "./FlowEdge";
import FlowExecutionLog from "./FlowExecutionLog";

@Table({ tableName: "flows" })
class Flow extends Model<Flow> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.TEXT)
  description: string | null;

  @Default(false)
  @Column
  isActive: boolean;

  @Default("keyword")
  @Column(DataType.STRING)
  triggerType: string;

  @Column(DataType.TEXT)
  triggerConfig: string | null;

  @HasMany(() => FlowNode)
  nodes: FlowNode[];

  @HasMany(() => FlowEdge)
  edges: FlowEdge[];

  @HasMany(() => FlowExecutionLog)
  executionLogs: FlowExecutionLog[];

  @CreatedAt
  @Column(DataType.DATE(6))
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE(6))
  updatedAt: Date;
}

export default Flow;
