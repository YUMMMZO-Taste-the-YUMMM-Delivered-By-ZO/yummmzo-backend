import { Router } from "express";
import { globalSearchController } from "./search.controller";

const router = Router();

router.get('/' , globalSearchController);

export default router;