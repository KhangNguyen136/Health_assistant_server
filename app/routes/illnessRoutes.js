const illness = require("../controllers/illnessController");
let express = require('express');
let router = express.Router();



// Create a new Illness
router.post("/", illness.create);

// Retrieve all Illnesss
router.get("/", illness.findAll);

// Retrieve all published Illnesss
router.get("/published", illness.findAllPublished);

// Retrieve a single Illness with id
// router.get("/:id", illness.findOne);

// Update a Illness with id
router.put("/:id", illness.update);

// Delete a Illness with id
router.delete("/:id", illness.delete);

// Create a new Illness
router.delete("/", illness.deleteAll);


router.get("/search", illness.searchbyName);

module.exports = router;