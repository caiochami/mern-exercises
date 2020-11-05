const router = require("express").Router();

let Exercise = require("../models/exercise.model");

router.route("/").get((req, res) => {
  Exercise.find()
    .then((exercises) => res.json(exercises))
    .catch((error) => res.status(400).json("Error: " + error));
});

router.route("/").post((req, res) => {
  const {username, description, duration, date} = req.body;
  
  const newExercise = new Exercise({
    username,
    description,
    duration,
    date
  });

  newExercise
    .save()
    .then(() => res.json("Exercise added"))
    .catch((error) => res.status(400).json("Error: " + error));
});

module.exports = router;
