const mongoose = require("mongoose");
const { Schema } = mongoose;

const TravelSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default:Date.now
  },
 on: {
  type: String,
  required: true,
  },

  vtype: {
    type: String,
    required: true,
  },
  vnumber: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
  buddies: {
    type: Number,
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

module.exports = mongoose.model("travel", TravelSchema);
