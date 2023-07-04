const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seller: {
    sellerName: {
      type: String,
      required: true,
    },
    sellerID: {
      type: String,
      required: true,
    },
  },

  product: {
    productName: {
      type: String,
      required: true,
    },
    productID: {
      type: String,
      required: true,
    },
    productPhoto: {
      type: Buffer,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productQuantity: {
      type: Number,
      required: true,
    },
    productTotalAmount: {
      type: Number,
      required: true,
    },
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
