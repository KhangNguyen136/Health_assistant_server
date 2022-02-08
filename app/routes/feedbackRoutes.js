const FeedbackController = require('../controllers/feedbackController');
let express = require('express');
let router = express.Router();

router.post("/save", FeedbackController.saveFeedback);


module.exports = router;