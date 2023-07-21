import exppress from "express";
import {
  createOrderCtrl,
  getAllordersCtrl,
  getSingleOrderCtrl,
  updateOrderCtrl,
  getOrderStatsCtrl,
  paymentVerificationCtrl,
} from "../controllers/orderCtrl.js";
import isLoggedIn from "../middlewares/isLoggedin.js";

const orderRouter = exppress.Router();

orderRouter.post("/", isLoggedIn, createOrderCtrl);
orderRouter.get("/", isLoggedIn, getAllordersCtrl);
orderRouter.get("/sales/stats", isLoggedIn, getOrderStatsCtrl);
orderRouter.put("/update/:id", isLoggedIn, updateOrderCtrl);
orderRouter.get("/:id", isLoggedIn, getSingleOrderCtrl);
orderRouter.post("/paymentVerification", paymentVerificationCtrl);
export default orderRouter;
