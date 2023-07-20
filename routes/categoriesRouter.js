import express from "express";
import {
  createCategoryCtrl,
  deleteCategoryCtrl,
  getAllCategoriesCtrl,
  getSingleCategoryCtrl,
  updateCategoryCtrl,
} from "../controllers/categoriesCtrl.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import catetgoryFileUpload from "../config/categoryFileUpload.js";
import isAdmin from "./../middlewares/isAdmin.js";

const categoriesRouter = express.Router();

categoriesRouter.post(
  "/",
  isLoggedin,
  isAdmin,
  catetgoryFileUpload.single("file"),
  createCategoryCtrl
);
categoriesRouter.get("/", getAllCategoriesCtrl);
categoriesRouter.get("/:id", getSingleCategoryCtrl);
categoriesRouter.put("/:id", isLoggedin, isAdmin, updateCategoryCtrl);
categoriesRouter.delete("/:id", isLoggedin, isAdmin, deleteCategoryCtrl);

export default categoriesRouter;
