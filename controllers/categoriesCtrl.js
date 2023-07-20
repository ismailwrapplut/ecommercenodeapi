import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";

//@desk Create new category
//@route POST /api/v1/categories
//@access Privaaattte/Admin

export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //category exists
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error("Category already exists");
  }
  //create
  const category = await Category.create({
    name: name?.toLowerCase(),
    user: req.userAuthId,
    image: req?.file?.path,
  });
  res.json({
    status: "success",
    message: "category created",
    category,
  });
});
//@desk get all category
//@route GET /api/v1/categories
//@access Public
export const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.json({
    status: "success",

    categories,
  });
});
//@desk get single category
//@route GET /api/v1/categories/:id
//@access Public

export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  res.json({
    status: "success",

    category,
  });
});
//@desk update category
//@route PUT /api/v1/categories/:id
//@access Private/Admin

export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );

  res.json({
    status: "success",

    category,
  });
});

//@desk delete category
//@route DELETE /api/v1/categories/:id
//@access Private/Admin

export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  res.json({
    status: "success",
  });
});
