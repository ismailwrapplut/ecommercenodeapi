import express from "express";
import {
  createCouponCtrl,
  deleteCouponCtrl,
  getAllCouponsCtrl,
  getCouponCtrl,
  updateCouponCtrl,
} from "../controllers/couponsCtrl.js";
import { isLoggedin } from "./../middlewares/isLoggedin.js";
import isAdmin from "./../middlewares/isAdmin.js";

const couponsRouter = express.Router();

couponsRouter.post("/", isLoggedin, isAdmin, createCouponCtrl);
couponsRouter.get("/", getAllCouponsCtrl);
couponsRouter.put("/update/:id", isLoggedin, isAdmin, updateCouponCtrl);
couponsRouter.delete("/delete/:id", isLoggedin, isAdmin, deleteCouponCtrl);
couponsRouter.get("/single", getCouponCtrl);

export default couponsRouter;
