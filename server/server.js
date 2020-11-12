const express = require("express");
const cors = require("cors");
const jsonwebtoken = require("jsonwebtoken");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const User = require("./models/user.model");
const Token = require("./models/token.model");

var NotFoundError = require("./errors/NotFoundError");

app.use(cors());

app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

function verifyJwt(req, res, next) {
  if (["/register", "/login"].includes(req.path)) return next();

  const authorizationParams = req.headers["authorization"];
  const token = authorizationParams && authorizationParams.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jsonwebtoken.verify(token, process.env.JWT_SECRET, async (error, user) => {
    if (error) return res.sendStatus(403);

    if (!(await Token.findOne({ token }))) {
      return res.status(404).json("Token not found");
    }

    let exists = await User.findOne({ email: user.email });

    if (!exists) {
      return res.status(404).json("User not found");
    }

    req.user = exists;
    next();
  });
}

app.use(verifyJwt);

app.use(function (err, req, res, next) {
  var code = 500,
    msg = { message: "Internal Server Error" };

  switch (err.name) {
    case "UnauthorizedError":
      code = err.status;
      msg = undefined;
      break;
    case "BadRequestError":
    case "UnauthorizedAccessError":
    case "NotFoundError":
      code = err.status;
      msg = err.inner;
      break;
    default:
      break;
  }

  return res.status(code).json(msg);
});

const authRouter = require("./routes/Auth");
const exercisesRouter = require("./routes/Exercises");
const usersRouter = require("./routes/Users");

app.use("/", authRouter);
app.use("/exercises", exercisesRouter);
app.use("/users", usersRouter);

app.all("*", function (req, res) {
  res.status(404).json(new NotFoundError("404"));
});

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
