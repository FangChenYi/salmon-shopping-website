const mongoose = require("mongoose");

const sellerOrderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  seller: {
    sellerID: {
      type: String,
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
  },
  buyer: {
    buyerName: {
      type: String,
      required: true,
    },
    buyerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  orders: [
    {
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
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const SellerOrder = mongoose.model("SellerOrder", sellerOrderSchema);

module.exports = SellerOrder;
