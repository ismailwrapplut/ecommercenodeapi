import dotenv from "dotenv";
import cors from "cors";
import Stripe from "stripe";
dotenv.config();
import express from "express";
import path from "path";
import dbConnect from "../config/dbConnect.js";
import { globalErrhandler, notFound } from "../middlewares/globalErrHandler.js";
import brandsRouter from "../routes/brandsRouter.js";
import categoriesRouter from "../routes/categoriesRouter.js";
import colorRouter from "../routes/colorRouter.js";
import orderRouter from "../routes/ordersRouter.js";
import productsRouter from "../routes/productsRoute.js";
import reviewRouter from "../routes/reviewRouter.js";
import userRoutes from "../routes/usersRoute.js";
import Order from "../model/Order.js";
import couponsRouter from "../routes/couponsRouter.js";

//db connect
dbConnect();
const app = express();
//cors
app.use(cors());
//Stripe webhook
//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_2a222b6d6b7abb9982f25d1da9e63f4d0a78f6935259e4ff65cae8df7b5fdde5";

//get key
app.get("/getKey", async (req, res) => {
  res.send(process.env.RAZORPAY_API_KEY_ID);
});

//pass incoming data
app.use(express.json());
//url encoded
app.use(express.urlencoded({ extended: true }));

//server static files
app.use(express.static("public"));
//routes
//Home route
app.get("/", (req, res) => {
  res.sendFile(path.join("public", "index.html"));
});
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productsRouter);
app.use("/api/v1/categories/", categoriesRouter);
app.use("/api/v1/brands/", brandsRouter);
app.use("/api/v1/colors/", colorRouter);
app.use("/api/v1/reviews/", reviewRouter);
app.use("/api/v1/orders/", orderRouter);
app.use("/api/v1/coupons/", couponsRouter);
//err middleware
app.use(notFound);
app.use(globalErrhandler);

export default app;
