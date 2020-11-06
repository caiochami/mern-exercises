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

router.route("/:id").get((req, res) => {
  const id = req.params.id;

  Exercise.findById(id)
  .then( exercise => res.json(exercise) )
  .catch(() => res.status(404).json("Exercise not found"));
});

router.route("/:id").delete((req, res) => {
const id = req.params.id;

Exercise.findByIdAndDelete(id)
.then( exercise => res.json("Exercise: " + exercise.id + " removed successfully") )
.catch(() => res.status(404).json("Exercise not found"));

});

router.route("/:id").put((req, res) => {
const id = req.params.id;

Exercise.findByIdAndUpdate(id, req.body)
.then( exercise => res.json("Exercise: " + exercise.id + " updated successfully") )
.catch(() => res.status(404).json("Exercise not found"));

});

module.exports = router;