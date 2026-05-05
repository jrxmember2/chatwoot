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
import Flow from "./Flow";
import FlowNode from "./FlowNode";

@Table({ tableName: "flow_edges" })
class FlowEdge extends Model<FlowEdge> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Flow)
  @Column
  flowId: number;

  @BelongsTo(() => Flow)
  flow: Flow;

  @ForeignKey(() => FlowNode)
  @Column
  sourceNodeId: number;

  @BelongsTo(() => FlowNode, "sourceNodeId")
  sourceNode: FlowNode;

  @ForeignKey(() => FlowNode)
  @Column
  targetNodeId: number;

  @BelongsTo(() => FlowNode, "targetNodeId")
  targetNode: FlowNode;

  @Column(DataType.STRING)
  conditionValue: string | null;

  @CreatedAt
  @Column(DataType.DATE(6))
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE(6))
  updatedAt: Date;
}

export default FlowEdge;
