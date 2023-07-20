import exppress from "express";
import {
  createOrderCtrl,
  getAllordersCtrl,
  getSingleOrderCtrl,
  updateOrderCtrl,
  getOrderStatsCtrl,
  productPriceUpdate,
} from "../controllers/orderCtrl.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";

const orderRouter = exppress.Router();

orderRouter.post("/", isLoggedin, createOrderCtrl);
orderRouter.get("/", isLoggedin, getAllordersCtrl);
orderRouter.get("/sales/stats", isLoggedin, getOrderStatsCtrl);
orderRouter.put("/update/:id", isLoggedin, updateOrderCtrl);
orderRouter.get("/:id", isLoggedin, getSingleOrderCtrl);
orderRouter.post("/update/price/:id", isLoggedin, productPriceUpdate);

export default orderRouter;
