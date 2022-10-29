const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb+srv://capstone2:abcd1234@cluster0.iqd2dqq.mongodb.net/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect Successfully");
  } catch (error) {
    console.log("Connect Fail");
  }
}

module.exports = { connect };

// mongodb+srv://capstone2:abcd1234@cluster0.iqd2dqq.mongodb.net/test