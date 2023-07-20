import express from "express";
import {
  createBrandCtrl,
  deleteBrandCtrl,
  getAllBrandsCtrl,
  getSingleBrandCtrl,
  updateBrandCtrl,
} from "../controllers/brandsCtrl.js";

import { isLoggedin } from "../middlewares/isLoggedin.js";
import isAdmin from "./../middlewares/isAdmin.js";

const brandsRouter = express.Router();

brandsRouter.post("/", isLoggedin, isAdmin, createBrandCtrl);
brandsRouter.get("/", getAllBrandsCtrl);
brandsRouter.get("/:id", getSingleBrandCtrl);
brandsRouter.delete("/:id", isLoggedin, isAdmin, deleteBrandCtrl);
brandsRouter.put("/:id", isLoggedin, isAdmin, updateBrandCtrl);

export default brandsRouter;
