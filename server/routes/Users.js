const router = require("express").Router();

let User = require("../models/user.model");

router.route("/").get((req, res) => {
  User.find().populate("exercises")
    .then((users) => res.json(users))
    .catch((error) => res.status(400).json("Error: " + error));
});

router.route("/").post((req, res) => {
  const {name, email, password} = req.body;
  const newUser = new User({
    name,
    email,
    password
  });

  newUser
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.status(400).json(error));
});

router.route("/mass-destroy").post(async (req, res) => {
  const { ids } = req.body;

  let deleted = await User.deleteMany({
    _id: {
      $in: ids,
    },
  });

  res.json(deleted);
});

router.route("/:id").get((req, res) => {
    const id = req.params.id;

    User.findById(id)
    .then( user => res.json(user) )
    .catch(() => res.status(404).json("User not found"));
});

router.route("/:id").delete((req, res) => {
  const id = req.params.id;

  User.findByIdAndDelete(id)
  .then( user => res.json("User: " + user.id + " removed successfully") )
  .catch(() => res.status(404).json("User not found"));

});

router.route("/:id").put((req, res) => {
  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body)
  .then( user => res.json("User: " + user.id + " updated successfully") )
  .catch(() => res.status(404).json("User not found"));

});

module.exports = router;
