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
const Image = require("./models/image-model");
const upload = require("./multer/multerMiddleware");
const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_CONNECTION)
  // .connect("mongodb://localhost:27017/projectDB")
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

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // 從 req.file.buffer 中取得圖片的 Buffer
    const imageBuffer = req.file.buffer;
    // 建立新的圖片物件
    // const { name } = req.body;
    const image = new Image({
      // name, // 從請求的表單中取得圖片名稱
      image: imageBuffer,
    });

    // 儲存圖片到資料庫
    await image.save();

    res.status(200).send("圖片上傳成功！");
  } catch (error) {
    console.error(error);
    res.status(500).send("伺服器錯誤");
  }
});

app.get("/upload", async (req, res) => {
  try {
    let foundProduct = await Image.find({}).exec();
    return res.send(foundProduct);
  } catch (e) {
    return res.status(500).send("載入商品過程發生錯誤");
  }
});

app.delete("/upload", async (req, res) => {
  try {
    let foundProduct = await Image.deleteMany({}).exec();
    return res.send(foundProduct);
  } catch (e) {
    return res.status(500).send("載入商品過程發生錯誤");
  }
});

// 查看所有商品;
app.get("/", async (req, res) => {
  try {
    let foundProduct = await Product.find({}).exec();
    return res.send(foundProduct);
  } catch (e) {
    return res.status(500).send("載入商品過程發生錯誤");
  }
});

// 使用商品名稱搜尋商品
app.get("/search/:title", async (req, res) => {
  let { title } = req.params;
  try {
    let foundProducts = await Product.find({
      title: { $regex: title, $options: "i" },
    }).exec();
    return res.send(foundProducts);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
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
