const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default:Date.now,
  },
  on:{
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("item", ItemSchema);
