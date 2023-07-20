import express from "express";
import {
  createProductCtrl,
  deleteProductCtrl,
  getProductCtrl,
  getProductsCtrl,
  updateProductCtrl,
} from "../controllers/productsCtrl.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";
import upload from "./../config/fileUpload.js";
import isAdmin from "./../middlewares/isAdmin.js";

const productsRouter = express.Router();

productsRouter.post(
  "/",
  isLoggedin,
  isAdmin,
  upload.array("files"),
  createProductCtrl
);
productsRouter.get("/", getProductsCtrl);
productsRouter.get("/:id", getProductCtrl);
productsRouter.put("/:id", isLoggedin, isAdmin, updateProductCtrl);
productsRouter.delete("/:id", isLoggedin, isAdmin, deleteProductCtrl);

export default productsRouter;
