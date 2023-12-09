const express = require("express");
const port = 8000;
require('./db');
 
var cors = require('cors') 
const app = express();
app.use(express.json());

app.use(cors());
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/travel", require("./routes/travel"));
app.use("/api/ticket", require("./routes/ticket"));
app.use("/api/item", require("./routes/item"));
app.use("/api/help", require("./routes/help"));
app.use("/api/event", require("./routes/event"));
app.use("/api/accept", require("./routes/mail"));

app.listen(port, () => {
  console.log(`easygo listening to port ${port}`);
});
