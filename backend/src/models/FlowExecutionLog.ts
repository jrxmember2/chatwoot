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
import Ticket from "./Ticket";
import Contact from "./Contact";
import FlowNode from "./FlowNode";

@Table({ tableName: "flow_execution_logs" })
class FlowExecutionLog extends Model<FlowExecutionLog> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Flow)
  @Column
  flowId: number;

  @BelongsTo(() => Flow)
  flow: Flow;

  @ForeignKey(() => Ticket)
  @Column(DataType.INTEGER)
  ticketId: number | null;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @ForeignKey(() => Contact)
  @Column(DataType.INTEGER)
  contactId: number | null;

  @BelongsTo(() => Contact)
  contact: Contact;

  @Column(DataType.STRING)
  triggerMessageId: string | null;

  @Column(DataType.STRING)
  status: string;

  @ForeignKey(() => FlowNode)
  @Column(DataType.INTEGER)
  currentNodeId: number | null;

  @BelongsTo(() => FlowNode, "currentNodeId")
  currentNode: FlowNode;

  @Column(DataType.TEXT)
  error: string | null;

  @CreatedAt
  @Column(DataType.DATE(6))
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE(6))
  updatedAt: Date;
}

export default FlowExecutionLog;
