import AppError from "../../errors/AppError";
import Flow from "../../models/Flow";

const DeleteFlowService = async (flowId: number): Promise<void> => {
  const flow = await Flow.findByPk(flowId);

  if (!flow) {
    throw new AppError("ERR_NO_FLOW_FOUND", 404);
  }

  await flow.destroy();
};

export default DeleteFlowService;
