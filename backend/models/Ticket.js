const mongoose = require("mongoose");
const { Schema } = mongoose;

const TicketSchema = new Schema({
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
  time: {
    type: String,
    required: true,
  },
  on: {
    type: String,
    required: true,
  },
  date:{
   type:Date,
   default:Date.now
  },
  count: {
    type: Number,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ticket", TicketSchema);
