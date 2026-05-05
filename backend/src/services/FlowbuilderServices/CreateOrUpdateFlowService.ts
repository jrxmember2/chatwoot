import AppError from "../../errors/AppError";
import sequelize from "../../database";
import Flow from "../../models/Flow";
import FlowEdge from "../../models/FlowEdge";
import FlowNode from "../../models/FlowNode";

interface FlowNodeInput {
  id?: number | string;
  clientId?: string;
  nodeType: string;
  label: string;
  positionX?: number;
  positionY?: number;
  config?: Record<string, unknown> | null;
}

interface FlowEdgeInput {
  sourceNodeId: number | string;
  targetNodeId: number | string;
  conditionValue?: string | null;
}

interface Request {
  flowId?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  triggerType?: string;
  triggerConfig?: Record<string, unknown> | null;
  nodes: FlowNodeInput[];
  edges: FlowEdgeInput[];
}

const allowedNodeTypes = [
  "send_message",
  "condition_contains",
  "transfer_queue",
  "close_ticket",
  "webhook"
];

const CreateOrUpdateFlowService = async ({
  flowId,
  name,
  description,
  isActive = false,
  triggerType = "keyword",
  triggerConfig,
  nodes,
  edges
}: Request): Promise<Flow> => {
  if (!name?.trim()) {
    throw new AppError("ERR_FLOW_NAME_REQUIRED", 400);
  }

  if (!Array.isArray(nodes) || nodes.length === 0) {
    throw new AppError("ERR_FLOW_NODES_REQUIRED", 400);
  }

  if (triggerType === "keyword") {
    const keyword = String(triggerConfig?.keyword || "").trim();

    if (!keyword) {
      throw new AppError("ERR_FLOW_KEYWORD_REQUIRED", 400);
    }
  }

  nodes.forEach(node => {
    if (!allowedNodeTypes.includes(node.nodeType)) {
      throw new AppError("ERR_FLOW_INVALID_NODE", 400);
    }
  });

  const transaction = await sequelize.transaction();

  try {
    let flow: Flow;

    if (flowId) {
      flow = await Flow.findByPk(flowId, { transaction }) as Flow;

      if (!flow) {
        throw new AppError("ERR_NO_FLOW_FOUND", 404);
      }

      await flow.update(
        {
          name: name.trim(),
          description: description?.trim() || null,
          isActive,
          triggerType,
          triggerConfig: JSON.stringify(triggerConfig || {})
        },
        { transaction }
      );

      await FlowEdge.destroy({
        where: { flowId: flow.id },
        transaction
      });
      await FlowNode.destroy({
        where: { flowId: flow.id },
        transaction
      });
    } else {
      flow = await Flow.create(
        {
          name: name.trim(),
          description: description?.trim() || null,
          isActive,
          triggerType,
          triggerConfig: JSON.stringify(triggerConfig || {})
        },
        { transaction }
      );
    }

    const nodeIdMap = new Map<string, number>();
    const createdNodes: FlowNode[] = [];

    for (const node of nodes) {
      const createdNode = await FlowNode.create(
        {
          flowId: flow.id,
          nodeType: node.nodeType,
          label: node.label,
          positionX: Number(node.positionX) || 0,
          positionY: Number(node.positionY) || 0,
          config: node.config ? JSON.stringify(node.config) : null
        },
        { transaction }
      );

      const referenceKey = String(node.clientId || node.id || createdNode.id);
      nodeIdMap.set(referenceKey, createdNode.id);
      createdNodes.push(createdNode);
    }

    for (const edge of edges || []) {
      const sourceNodeId = nodeIdMap.get(String(edge.sourceNodeId));
      const targetNodeId = nodeIdMap.get(String(edge.targetNodeId));

      if (!sourceNodeId || !targetNodeId) {
        continue;
      }

      await FlowEdge.create(
        {
          flowId: flow.id,
          sourceNodeId,
          targetNodeId,
          conditionValue: edge.conditionValue || null
        },
        { transaction }
      );
    }

    await transaction.commit();

    const savedFlow = await Flow.findByPk(flow.id, {
      include: ["nodes", "edges"]
    });

    if (!savedFlow) {
      throw new AppError("ERR_NO_FLOW_FOUND", 404);
    }

    return savedFlow;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export default CreateOrUpdateFlowService;
