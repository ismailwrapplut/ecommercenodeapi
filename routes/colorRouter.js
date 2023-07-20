import exppress from "express";
import {
  createColorCtrl,
  deleteColorCtrl,
  getAllColorsCtrl,
  getSingleColorCtrl,
  updateColorCtrl,
} from "../controllers/colorsCtrl.js";

import { isLoggedin } from "../middlewares/isLoggedin.js";
import isAdmin from "./../middlewares/isAdmin.js";

const colorRouter = exppress.Router();

colorRouter.post("/", isLoggedin, isAdmin, createColorCtrl);
colorRouter.get("/", getAllColorsCtrl);
colorRouter.get("/:id", getSingleColorCtrl);
colorRouter.delete("/:id", isLoggedin, isAdmin, deleteColorCtrl);
colorRouter.put("/:id", isLoggedin, isAdmin, updateColorCtrl);

export default colorRouter;
