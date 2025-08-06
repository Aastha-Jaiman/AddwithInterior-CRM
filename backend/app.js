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
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"
],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send("Setup backend");
});

const adminRoute = require('./routes/admin.router');
const clientRoute = require('./routes/client.router');
const contactRoute = require('./routes/contact.router');
const projectRoute = require('./routes/project.router');
const brochurRoute = require('./routes/brochur.router');
const designRoute = require('./routes/design.router');

app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/client", clientRoute);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/project", projectRoute);
app.use("/api/v1/brochure", brochurRoute);
app.use("/api/v1/design", designRoute)

module.exports = app;