import express from "express";
import {
  getUserProfileCtrl,
  loginUserCtrl,
  registerUserCtrl,
  updateShippingAddresctrl,
} from "../controllers/usersCtrl.js";
import { isLoggedin } from "../middlewares/isLoggedin.js";

const userRoutes = express.Router();
userRoutes.put("/update/shipping", isLoggedin, updateShippingAddresctrl);
userRoutes.post("/register", registerUserCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.get("/profile", isLoggedin, getUserProfileCtrl);

export default userRoutes;
