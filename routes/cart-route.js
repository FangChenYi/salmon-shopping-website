const router = require("express").Router();
const Cart = require("../models").cart;
const Product = require("../models").product;

router.use((req, res, next) => {
  console.log("cart route..");
  next();
});

router.get("/", async (req, res) => {
  try {
    const cartFound = await Cart.find({ user: req.user._id }).exec();
    return res.send(cartFound);
  } catch (e) {
    console.log(e);
    return res.status(500).send("無法查看商品");
  }
});

router.post("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let productFound = await Product.findOne({ _id }).exec();
    if (req.user._id.equals(productFound.sellerID)) {
      return res.status(400).send("無法將賣家自己的商品加入購物車");
    }

    let cartFound = await Cart.findOne({
      "product.productID": productFound._id,
      user: req.user._id,
    }).exec();

    if (cartFound) {
      try {
        // console.log(cartFound.product.productQuantity);
        const newQuantity = (cartFound.product.productQuantity += 1);
        cartFound.product.productTotalAmount =
          cartFound.product.productPrice * newQuantity;
        await cartFound.save();
        return res.send({ message: "已將數量增加至購物車", cart: cartFound });
      } catch (e) {
        console.log(e);
      }
    }

    let newCart = new Cart({
      user: req.user._id,
      seller: {
        sellerName: productFound.sellerName,
        sellerID: productFound.sellerID,
      },
      product: {
        productName: productFound.name,
        productID: productFound._id,
        productPhoto: productFound.photo,
        productPrice: productFound.price,
        productQuantity: 1,
        productTotalAmount: productFound.price * 1,
      },
      date: Date.now(),
    });

    let newCartSaved = await newCart.save();
    return res.send({ message: "已新增至購物車", newCartSaved });
  } catch (e) {
    console.log(e);
    return res.status(500).send("無法新增至購物車");
  }
});

router.patch("/:_id", async (req, res) => {
  let { _id } = req.params;
  let { productQuantity, productTotalAmount } = req.body;
  try {
    let productFound = await Product.findOne({ _id }).exec();
    if (productFound) {
      let cartUpdated = await Cart.findOneAndUpdate(
        {
          "product.productID": productFound._id,
          user: req.user._id,
        },
        {
          $set: {
            "product.productQuantity": productQuantity,
            "product.productTotalAmount": productTotalAmount,
          },
        },

        { new: true }
      ).exec();
      if (cartUpdated) {
        return res.send({ message: "已更新商品數量", cartUpdated });
      } else {
        return res.send("找不到商品");
      }
    } else {
      return res.send("找不到商品");
    }
  } catch (e) {
    console.log(e);
  }
});

router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let productFound = await Product.findOne({ _id }).exec();
    if (productFound) {
      await Cart.deleteOne({
        "product.productID": productFound._id,
        user: req.user._id,
      }).exec();
      return res.send("已刪除資料");
    } else {
      return res.send("無法刪除資料");
    }
  } catch (e) {
    console.log(e);
  }
});

// router.delete("/", async (req, res) => {
//   try {
//     let cartFound = await Cart.deleteMany({}).exec();
//     return res.send(cartFound);
//   } catch (e) {
//     console.log(e);
//   }
// });

module.exports = router;
