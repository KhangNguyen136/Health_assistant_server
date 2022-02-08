const FeedbackController = require('../controllers/userInfoController');
let express = require('express');
let router = express.Router();

router.post("/register", FeedbackController.register);

router.post("/updateInfo", FeedbackController.updateInfo);

module.exports = router;