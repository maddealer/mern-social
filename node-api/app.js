const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//db MONGO
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoDB connected");
  });
mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});

//bring in routes
const postRoutes = require("./routes/post");

//middleware
app.use(morgan("dev"));

app.use("/", postRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server started on port:${port}`);
});
