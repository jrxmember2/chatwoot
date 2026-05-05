import { Request, Response } from "express";
import AppError from "../errors/AppError";
import CreateOrUpdateFlowService from "../services/FlowbuilderServices/CreateOrUpdateFlowService";
import DeleteFlowService from "../services/FlowbuilderServices/DeleteFlowService";
import ListFlowsService from "../services/FlowbuilderServices/ListFlowsService";
import ShowFlowService from "../services/FlowbuilderServices/ShowFlowService";

const ensureAdmin = (req: Request): void => {
  if (!req.user || req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }
};

export const index = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);
  const flows = await ListFlowsService();

  return res.status(200).json(flows);
};

export const show = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);
  const flow = await ShowFlowService(Number(req.params.flowId));

  return res.status(200).json(flow);
};

export const store = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);

  const flow = await CreateOrUpdateFlowService({
    name: req.body.name,
    description: req.body.description,
    isActive: Boolean(req.body.isActive),
    triggerType: req.body.triggerType || "keyword",
    triggerConfig: req.body.triggerConfig || {},
    nodes: req.body.nodes || [],
    edges: req.body.edges || []
  });

  return res.status(201).json(flow);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);

  const flow = await CreateOrUpdateFlowService({
    flowId: Number(req.params.flowId),
    name: req.body.name,
    description: req.body.description,
    isActive: Boolean(req.body.isActive),
    triggerType: req.body.triggerType || "keyword",
    triggerConfig: req.body.triggerConfig || {},
    nodes: req.body.nodes || [],
    edges: req.body.edges || []
  });

  return res.status(200).json(flow);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);
  await DeleteFlowService(Number(req.params.flowId));

  return res.status(200).json({ message: "Flow deleted" });
};
