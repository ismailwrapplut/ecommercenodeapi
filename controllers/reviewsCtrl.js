//@desc Create new review
import asyncHandler from "express-async-handler";
import Product from "./../model/Product.js";
import Review from "./../model/Review.js";
//@Route POST /api/v1/reviews
//@access Private/Admin

export const createReviewCtrl = asyncHandler(async (req, res) => {
  const { product, message, rating } = req.body;
  //find product
  const { productID } = req.params;
  const productFound = await Product.findById(productID).populate("reviews");
  if (!productFound) {
    throw new Error("Product not found with the id");
  }
  //check if user already review this product
  const hasReviewed = productFound?.reviews.find((r) => {
    return r?.user.toString() === req?.userAuthId;
  });
  if (hasReviewed) {
    throw new Error("You have already reviewd this product.0");
  }
  //create review
  const review = await Review.create({
    message,
    rating,
    product: productFound?._id,
    user: req.userAuthId,
  });

  //Push review in to prouduct
  productFound.reviews.push(review?._id);
  await productFound.save();

  res.status(201).json({
    success: "true",
    message: "Review created successfully",
  });
});
