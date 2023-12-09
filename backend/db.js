const mongoose = require("mongoose");
//const mongoURI = "mongodb://localhost:27017";

 mongoose.connect("mongodb://127.0.0.1:27017/EasyGo?directConnection=true&ssl=false&readPreference=primary&appname=MongoDB%20Compass")
  .then(() => {
    console.log(`connection successful`);
  })
  .catch((e) => {
    console.log(e);
    console.log(`no connection`);
  });
 
