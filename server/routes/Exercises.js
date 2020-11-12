const router = require("express").Router();

let Exercise = require("../models/exercise.model");
const User = require("../models/user.model");

router.route("/").get((req, res) => {
  Exercise.find()
    .populate("user", "name")
    .then((exercises) => res.json(exercises))
    .catch((error) => res.status(400).json("Error: " + error));
});

router.route("/").post(async (req, res) => {
  const { user, description, duration, date } = req.body;

  const newExercise = await new Exercise({
    user,
    description,
    duration,
    date,
  })
    .save()
    .then((exercise) => {
      return exercise;
    })
    .catch((error) => res.status(400).json("Error: " + error));

  const registeredUser = await User.findById(newExercise.user._id)
    .populate("exercises")
    .then((user) => {
      return user;
    });
  
  registeredUser.exercises.push(newExercise)
  await registeredUser.save()

  console.log(newExercise, registeredUser);
  res.json(newExercise);
});

router.route("/mass-delete").post(async (req, res) => {
  const { ids } = req.body;

  let query = {
    _id: {
      $in: ids,
    },
  };

  let deleted = await Exercise.deleteMany(query);

  res.json(deleted);
});

router.route("/:id").get((req, res) => {
  const id = req.params.id;

  Exercise.findById(id)
    .populate("user")
    .then((exercise) => res.json(exercise))
    .catch(() => res.status(404).json("Exercise not found"));
});

router.route("/:id").delete((req, res) => {
  const id = req.params.id;

  Exercise.findByIdAndDelete(id)
    .then((exercise) => res.json(exercise))
    .catch(() => res.status(404).json("Exercise not found"));
});

router.route("/:id").put((req, res) => {
  const id = req.params.id;

  Exercise.findByIdAndUpdate(id, req.body)
    .then((exercise) =>
      res.json("Exercise: " + exercise.id + " updated successfully")
    )
    .catch(() => res.status(404).json("Exercise not found"));
});

module.exports = router;
