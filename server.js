const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const { authRoute, sellerRoute, cartRoute, orderRoute } = require("./routes");
const passport = require("passport");
require("./config/passport")(passport);
const Product = require("./models").product;
const path = require("path");
const port = process.env.PORT || 8080;

mongoose
  // .connect(process.env.MONGODB_CONNECTION)
  .connect("mongodb://localhost:27017/projectDB")
  .then(() => {
    console.log("Connecting to mongodb..");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")));
app.use("/user", authRoute);
app.use(
  "/user/cart",
  passport.authenticate("jwt", { session: false }),
  cartRoute
);

app.use(
  "/user/order",
  passport.authenticate("jwt", { session: false }),
  orderRoute
);

app.use(
  "/seller",
  passport.authenticate("jwt", { session: false }),
  sellerRoute
);

// 查看所有商品;
app.get("/", async (req, res) => {
  try {
    let foundProduct = await Product.find({}).exec();
    return res.send(foundProduct);
  } catch (e) {
    return res.status(500).send("載入商品過程發生錯誤");
  }
});

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log("port 8080..");
});
