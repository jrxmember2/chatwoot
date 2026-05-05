import { Router } from "express";
import isAuth from "../middleware/isAuth";
import * as EvolutionController from "../controllers/EvolutionController";

const evolutionRoutes = Router();

evolutionRoutes.post("/evolution/test", isAuth, EvolutionController.test);

export default evolutionRoutes;
