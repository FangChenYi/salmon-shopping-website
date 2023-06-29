const router = require("express").Router();
const Product = require("../models").product;
const Order = require("../models").order;
const SellerOrder = require("../models").sellerOrder;
const Cart = require("../models").cart;
const productValidation = require("../validation.js").productValidation;

router.use((req, res, next) => {
  console.log("seller route..");
  next();
});

// 查看賣家自己的所有商品
router.get("/", async (req, res) => {
  try {
    const productFound = await Product.find({ sellerID: req.user._id }).exec();
    return res.send(productFound);
  } catch (e) {
    console.log(e);
    return res.status(500).send("無法查看商品");
  }
});

// 取得賣家的訂單
router.get("/order", async (req, res) => {
  try {
    let sellerOrderFound = await SellerOrder.find({
      user: req.user._id,
    }).exec();
    if (sellerOrderFound) {
      return res.send(sellerOrderFound);
    } else {
      return res.send("找不到");
    }
  } catch (e) {
    return res.send(e);
  }
});

router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    const productFound = await Product.find({ _id }).exec();
    return res.send(productFound);
  } catch (e) {
    return res.status(500).send("無法查看商品");
  }
});

// 新增商品
router.post("/", async (req, res) => {
  let { error } = productValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { photo, name, description, price, date } = req.body;
  try {
    let newProduct = new Product({
      photo,
      name,
      description,
      price,
      sellerName: req.user.username,
      sellerID: req.user._id,
      date,
    });
    let savedProduct = await newProduct.save();

    return res.send({
      message: "已新增商品",
      savedProduct,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("無法新增商品");
  }
});

// 修改商品資料
router.put("/edit/:_id", async (req, res) => {
  let { _id } = req.params;
  let { error } = productValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { photo, name, description, price } = req.body;
  try {
    let productFound = await Product.findOne({ _id }).exec();
    if (!productFound) {
      return res.status(404).send("找不到此商品");
    }
    if (!productFound.sellerID.equals(req.user._id)) {
      return res.status(403).send("只有商品的賣家才能修改資料");
    }

    if (productFound) {
      productFound.photo = photo;
      productFound.name = name;
      productFound.description = description;
      productFound.price = price;
    }

    let cartFound = await Cart.findOneAndUpdate(
      {
        "product.productID": productFound._id,
      },
      {
        $set: {
          "product.productPhoto": photo,
          "product.productName": name,
          "product.productPrice": price,
        },
      },
      { new: true }
    ).exec();
    let updatedProduct = await productFound.save();
    if (cartFound && updatedProduct) {
      return res.send({
        message: "商品資料已更新",
      });
    } else {
      return res.send("無法更新");
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send("無法更新商品資料");
  }
});

// 賣家完成訂單後要刪除兩邊的訂單
router.delete("/order/:orderID", async (req, res) => {
  let { orderID } = req.params;
  try {
    let orderDelete = await Order.deleteOne({ orderID }).exec();
    let sellerOrderDelete = await SellerOrder.deleteOne({ orderID }).exec();
    if (orderDelete && sellerOrderDelete) {
      return res.send({ orderDelete, sellerOrderDelete });
    }
  } catch (e) {
    console.log(e);
  }
});

// router.delete("/order", async (req, res) => {
//   try {
//     await Order.deleteMany({}).exec();
//     await SellerOrder.deleteMany({}).exec();
//   } catch (e) {
//     console.log(e);
//   }
// });

// 刪除商品
router.delete("/edit/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let productFound = await Product.findOne({ _id }).exec();
    if (!productFound) {
      return res.status(500).send("找不到此商品，無法刪除商品");
    }
    if (productFound.sellerID.equals(req.user._id)) {
      await Product.deleteOne({ _id });
      await Cart.deleteMany({ "product.productID": _id });
      return res.send("商品已刪除");
    } else {
      return res.status(403).send("只有此商品的賣家才能刪除商品");
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send("找不到此商品，無法刪除商品");
  }
});

// router.delete("/", async (req, res) => {
//   try {
//     await Product.deleteMany({}).exec();
//   } catch (e) {
//     console.log(e);
//   }
// });

module.exports = router;
