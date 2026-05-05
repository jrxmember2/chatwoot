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
import Flow from "./Flow";
import FlowEdge from "./FlowEdge";

@Table({ tableName: "flow_nodes" })
class FlowNode extends Model<FlowNode> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Flow)
  @Column
  flowId: number;

  @BelongsTo(() => Flow)
  flow: Flow;

  @Column(DataType.STRING)
  nodeType: string;

  @Column(DataType.STRING)
  label: string;

  @Column(DataType.FLOAT)
  positionX: number;

  @Column(DataType.FLOAT)
  positionY: number;

  @Column(DataType.TEXT)
  config: string | null;

  @HasMany(() => FlowEdge, "sourceNodeId")
  outgoingEdges: FlowEdge[];

  @HasMany(() => FlowEdge, "targetNodeId")
  incomingEdges: FlowEdge[];

  @CreatedAt
  @Column(DataType.DATE(6))
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE(6))
  updatedAt: Date;
}

export default FlowNode;
