const router = require("express").Router();
const Cart = require("../models").cart;
const Product = require("../models").product;
const Order = require("../models/").order;
const SellerOrder = require("../models").sellerOrder;
const User = require("../models").user;

router.use((req, res, next) => {
  console.log("order route..");
  next();
});

// 使用訂單id查看訂單
// router.get("/:_id", async (req, res) => {
//   let { _id } = req.params;
//   try {
//     let orderFound = await Order.findOne({ _id }).exec();
//     if (orderFound) {
//       return res.send(orderFound);
//     } else {
//       return res.send("不存在，無法查看");
//     }
//   } catch (e) {
//     console.log(e);
//     return res.status(500).send("無法查看");
//   }
// });

// 查看使用者目前的訂單
router.get("/", async (req, res) => {
  try {
    let orderFound = await Order.find({ user: req.user._id }).exec();
    return res.send(orderFound);
  } catch (e) {
    console.log(e);
    return res.status(500).send("無法查看");
  }
});

router.post("/:sellerID", async (req, res) => {
  let { sellerID } = req.params;
  try {
    let cartFound = await Cart.find({
      "seller.sellerID": sellerID,
      user: req.user._id,
    }).exec();
    if (cartFound.length > 0) {
      const orderID = generateOrderID();
      const orderItems = {
        orderID: orderID,
        user: req.user._id,
        seller: {
          sellerID: cartFound[0].seller.sellerID,
          sellerName: cartFound[0].seller.sellerName,
        },
        buyer: {
          buyerID: req.user._id,
          buyerName: req.user.username,
        },
        orders: cartFound.map((cartItem) => ({
          product: {
            productID: cartItem.product.productID,
            productPhoto: cartItem.product.productPhoto,
            productName: cartItem.product.productName,
            productPrice: cartItem.product.productPrice,
            productQuantity: cartItem.product.productQuantity,
            productTotalAmount: cartItem.product.productTotalAmount,
          },
        })),
      };
      const sellerOrderItems = {
        orderID: orderID,
        user: cartFound[0].seller.sellerID,
        seller: {
          sellerID: cartFound[0].seller.sellerID,
          sellerName: cartFound[0].seller.sellerName,
        },
        buyer: {
          buyerID: req.user._id,
          buyerName: req.user.username,
        },
        orders: cartFound.map((cartItem) => ({
          product: {
            productID: cartItem.product.productID,
            productPhoto: cartItem.product.productPhoto,
            productName: cartItem.product.productName,
            productPrice: cartItem.product.productPrice,
            productQuantity: cartItem.product.productQuantity,
            productTotalAmount: cartItem.product.productTotalAmount,
          },
        })),
      };

      const newOrder = await Order.create(orderItems);
      const newSellerOrder = await SellerOrder.create(sellerOrderItems);

      if (newOrder && newSellerOrder) {
        await Cart.deleteMany({
          "seller.sellerID": sellerID,
          user: req.user._id,
        });
      }

      return res.send({ message: "已成功送出訂單", newOrder, newSellerOrder });
    }

    return res.send("找不到此賣家的商品，無法送出訂單");
  } catch (error) {
    console.log(error);
    return res.status(500).send("無法送出訂單");
  }
});

router.delete("/", async (req, res) => {
  try {
    let orderDelete = await Order.deleteMany({}).exec();
    let sellerOrderDelete = await SellerOrder.deleteMany({}).exec();
    if (orderDelete && sellerOrderDelete) {
      return res.send({ orderDelete, sellerOrderDelete });
    }
  } catch (e) {
    console.log(e);
  }
});

function generateOrderID() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return timestamp + random;
}

module.exports = router;
