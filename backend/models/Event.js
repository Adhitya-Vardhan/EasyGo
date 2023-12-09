const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  ename: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  eon: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default:Date.now,
  },
  tag: {
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

module.exports = mongoose.model("event", EventSchema);
