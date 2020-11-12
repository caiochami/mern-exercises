const router = require("express").Router();

const { body } = require("express-validator");

const User = require("../models/user.model");

var UnavailableError = require("../errors/UnavailableError");

const validate = require("../utils/validate");
const UnauthorizedAccessError = require("../errors/UnauthorizedAccessError");

const AUTH_RULES = [
  body("email").isEmail().notEmpty(),
  body("password").isLength({ min: 3 }).notEmpty().isString(),
];

router.post("/login", validate(AUTH_RULES), async (req, res) => {
  const { email, password } = req.body;

  process.nextTick(async () => {
    let user = await User.findOne(
      {
        email,
      },
      function (err, user) {
        if (err || !user) {
          return next(
            new UnauthorizedAccessError("401", {
              message: "Invalid username or password",
            })
          );
        }

        user.comparePassword(password, async function (err, isMatch) {
          if (isMatch && !err) {
            await user
              .createToken()
              .then((token) => {
                res.json(token);
              })
              .catch((error) => {
                res.status(400).json(error);
              });
          } else {
            return res.status(422).json(
              new UnauthorizedAccessError("422", {
                message: "Credentials does not match our records",
              })
            );
          }
        });
      }
    );
  });
});

router.post("/logout", function (req, res) {
  console.log(req.user);
});

router.post("/tokens", async function (req, res) {
  const user = await User.findOne({ email: req.user.email });

  if (user) {
    res.json(await user.tokens());
  } else {
    res.json("user not found");
  }
});

router.post(
  "/register",
  validate([
    ...AUTH_RULES,
    body("name").trim().escape().isString().notEmpty().isLength({ min: 5 }),
    body("password_confirmation")
      .notEmpty()
      .isString()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match password");
        }

        // Indicates the success of this synchronous custom validator
        return true;
      }),
  ]),
  async (req, res) => {
    const { name, email, password } = req.body;

    const newUser = new User({
      name,
      email,
      password,
    });
    newUser.save(async function (err, user) {
      if (err) {
        if (err.name === "MongoError" && err.code === 11000) {
          res.status(422).json(new UnavailableError(400, err));
        }
      } else {
        res.json(await user.createToken());
      }

      //process.exit();
    });
  }
);
module.exports = router;
