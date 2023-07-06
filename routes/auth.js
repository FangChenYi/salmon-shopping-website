const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("經過Auth...");
  next();
});

router.get("/", async (req, res) => {
  try {
    const foundUser = await User.find();
    return res.send(foundUser);
  } catch (error) {
    return res.status(500).send("無法取得使用者列表");
  }
});

router.post("/register", async (req, res) => {
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email已被使用");
  const usernameExist = await User.findOne({ email: req.body.username });
  if (usernameExist) return res.status(400).send("使用者名稱已被使用");

  let { username, email, password } = req.body;
  let newUser = new User({ username, email, password });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "註冊成功",
      savedUser,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("無法註冊使用者");
  }
});

router.post("/login", async (req, res) => {
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    return res.status(400).send("找不到使用者，請確認是否輸入正確");
  }
  // 只回傳必要資訊到使用者的localStorage
  const userProfile = {
    _id: foundUser._id,
    username: foundUser.username,
    email: foundUser.email,
  };

  foundUser.comparePassword(req.body.password, (err, match) => {
    if (err) return res.status.send(err);
    if (match) {
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        message: "成功登入",
        token: "JWT " + token,
        user: userProfile,
      });
    } else {
      return res.status(401).send("密碼錯誤");
    }
  });
});

// router.delete("/:_id", async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params._id);
//     if (!deletedUser) {
//       return res.status(404).send("找不到使用者");
//     }
//     return res.send({
//       msg: "使用者已成功刪除",
//       deletedUser,
//     });
//   } catch (error) {
//     return res.status(500).send("無法刪除使用者");
//   }
// });

module.exports = router;
