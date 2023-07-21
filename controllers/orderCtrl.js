import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../model/Order.js";
import Product from "../model/Product.js";
import User from "../model/User.js";
import Coupon from "../model/Coupon.js";
import Razorpay from "razorpay";
import crypto from "crypto";
//@desc create orders
//@route POST /api/v1/orders
//@access private

//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);
console.log(process.env.RAZORPAY_API_KEY_ID);
console.log(process.env.RAZORPAY_API_KEY_SECRET);

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY_ID,
  key_secret: process.env.RAZORPAY_API_KEY_SECRET,
});

export const createOrderCtrl = asyncHandler(async (req, res) => {
  // //get teh coupon
  // const { coupon } = req?.query;

  // const couponFound = await Coupon.findOne({
  //   code: coupon?.toUpperCase(),
  // });
  // if (couponFound?.isExpired) {
  //   throw new Error("Coupon has expired");
  // }
  // if (!couponFound) {
  //   throw new Error("Coupon does exists");
  // }

  //get discount
  // const discount = couponFound?.discount / 100;

  //Get the payload(customer, orderItems, shipppingAddress, totalPrice);
  const { orderItems, shippingAddress, totalPrice } = req.body;
  console.log(req.body);
  //Find the user
  const user = await User.findById(req.userAuthId);
  //Check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }
  //Check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("No Order Items");
  }
  //Place/create order - save into DB

  //Update the product qty
  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });
  //push order into user

  //make payment (stripe)
  //convert order items to have same structure that stripe need
  var options = {
    amount: +totalPrice * 100, // amount in the smallest currency unit
    currency: "INR",
  };
  await instance.orders.create(options, async function (err, order) {
    if (order) {
      const orderCreate = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,
        // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
        totalPrice,
        razorpayOrderId: order.id,
      });
      user.orders.push(orderCreate?._id);
      await user.save();

      res.json({
        order,
        orderCreate,
      });
    }
  });
});

//@desc get all orders
//@route GET /api/v1/orders
//@access private

export const getAllordersCtrl = asyncHandler(async (req, res) => {
  //find all orders
  const orders = await Order.find().populate("user");
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

//@desc get single order
//@route GET /api/v1/orders/:id
//@access private/admin

export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  const order = await Order.findById(id);
  //send response
  res.status(200).json({
    success: true,
    message: "Single order",
    order,
  });
});

//@desc update order to delivered
//@route PUT /api/v1/orders/update/:id
//@access private/admin

export const updateOrderCtrl = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  //update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Order updated",
    updatedOrder,
  });
});

//@desc get sales sum of orders
//@route GET /api/v1/orders/sales/sum
//@access private/admin

export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
  //get order stats
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);
  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  //send response
  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    saleToday,
  });
});

export const paymentVerificationCtrl = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (generated_signature == razorpay_signature) {
    const orderFound = await Order.findOneAndUpdate(
      {
        razorpayOrderId: razorpay_order_id,
      },
      {
        paymentStatus: "paid",
        currency: "INR",
      },
      {
        new: true,
      }
    );

    console.log(orderFound);
    res.redirect("http://localhost:3000/success");
  } else {
    res.redirect("http://localhost:3000/failed");
  }
});
