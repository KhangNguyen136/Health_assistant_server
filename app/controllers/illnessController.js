const db = require("../models");
const Illness = db.illness;

// Create and Save a new illness
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const

  // Create a Illness
  const illness = new Illness({
    //.....
  });

  // Save Illness in the database
  illness
    .save(illness)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the illness."
      });
    });
};

// Retrieve all illness from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Illness.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving illnesses."
      });
    });
};

// Find a single illness with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Illness.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found illness with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving illness with id=" + id });
    });
};

// Update a Illness by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Illness.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Illness with id=${id}. Maybe Illness was not found!`
        });
      } else res.send({ message: "Illness was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Illness with id=" + id
      });
    });
};

// Delete a Illnesss with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Illness.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Illness with id=${id}. Maybe Illness was not found!`
        });
      } else {
        res.send({
          message: "Illness was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Illness with id=" + id
      });
    });
};

// Delete all Illnesss from the database.
exports.deleteAll = (req, res) => {
  Illness.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Illnesss were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Illnesss."
      });
    });
};

// Find all published Illnesss
exports.findAllPublished = (req, res) => {
  Illness.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Illnesss."
      });
    });
};
