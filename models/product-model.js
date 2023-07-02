const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  photo: {
    type: Buffer,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 80,
  },
  price: {
    type: Number,
    required: true,
    minlength: 1,
  },
  sellerName: {
    type: String,
    required: true,
  },
  sellerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  buyer: {
    type: [String],
    default: [],
  },
  soldCount: {
    type: [Number],
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
