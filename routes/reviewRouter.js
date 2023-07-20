import express from "express";
import { createReviewCtrl } from "../controllers/reviewsCtrl.js";
import { isLoggedin } from "./../middlewares/isLoggedin.js";

const reviewRouter = express.Router();

reviewRouter.post("/:productID", isLoggedin, createReviewCtrl);
export default reviewRouter;
