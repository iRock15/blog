const express = require("express");

const userRouter = require("./routers/user");
const authRouter = require("./routers/auth");
const postRouter = require("./routers/post");
const groupRouter = require("./routers/group");
const errorHandler = require("./middleware/error");
const notFoundHandler = require("./middleware/not-found");

const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const User = require("./model/user");

const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));
app.use(cors());

app.use(userRouter);
app.use(authRouter);
app.use(postRouter);
app.use(groupRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
