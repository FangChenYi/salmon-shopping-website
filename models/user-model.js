const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 80,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 30,
  },
  googleID: {
    type: String,
  },
  token: [String],
});

userSchema.methods.comparePassword = async function (password, cb) {
  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    // console.log(result);
    return cb(null, result);
  } catch (e) {
    return cb(e, result);
  }
};

// 儲存前的middleware
// 確認是新用戶
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const hashValue = await bcrypt.hash(this.password, 12);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
