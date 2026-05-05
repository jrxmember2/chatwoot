import AppError from "../../errors/AppError";
import Flow from "../../models/Flow";
import FlowEdge from "../../models/FlowEdge";
import FlowNode from "../../models/FlowNode";

const ShowFlowService = async (flowId: number): Promise<Flow> => {
  const flow = await Flow.findByPk(flowId, {
    include: [
      {
        model: FlowNode,
        as: "nodes"
      },
      {
        model: FlowEdge,
        as: "edges"
      }
    ]
  });

  if (!flow) {
    throw new AppError("ERR_NO_FLOW_FOUND", 404);
  }

  return flow;
};

export default ShowFlowService;
