const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imagePhoto: {
    type: Buffer,
    required: true,
  },
});

module.exports = mongoose.model("Image", imageSchema);
