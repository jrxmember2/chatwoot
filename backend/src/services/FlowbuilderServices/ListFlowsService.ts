import Flow from "../../models/Flow";
import FlowEdge from "../../models/FlowEdge";
import FlowNode from "../../models/FlowNode";

const ListFlowsService = async (): Promise<Flow[]> => {
  return Flow.findAll({
    include: [
      {
        model: FlowNode,
        as: "nodes"
      },
      {
        model: FlowEdge,
        as: "edges"
      }
    ],
    order: [["createdAt", "DESC"]]
  });
};

export default ListFlowsService;
