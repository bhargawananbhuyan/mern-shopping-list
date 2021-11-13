require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT || 5000;

(async () => {
  const app = express();

  // middlewares
  app.use(express.json());
  app.use(cors({ origin: "http://localhost:3000" }));

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("connected to db...");
  } catch (error) {
    console.log(error.message);
  }

  app.use("/grocery", require("./routes"));

  app.listen(port, () => {
    console.log(`listening to app on port ${port}...`);
  });
})();
