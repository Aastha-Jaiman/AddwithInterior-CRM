const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send("Setup backend");
});

const adminRoute = require('./routes/admin.router');
const clientRoute = require('./routes/client.router');

// console.log(userRoute)

app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/client", clientRoute);

module.exports = app;