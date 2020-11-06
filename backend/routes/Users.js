const router = require("express").Router();

let User = require("../models/user.model");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((error) => res.status(400).json("Error: " + error));
});

router.route("/").post((req, res) => {
  const username = req.body.username;
  const newUser = new User({
    username,
  });

  newUser
    .save()
    .then(() => res.json("User added"))
    .catch((error) => res.status(400).json("Error: " + error));
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
