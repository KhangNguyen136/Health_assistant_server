const UserInfoController = require('../controllers/userInfoController');
let express = require('express');
let router = express.Router();

router.post("/register", UserInfoController.register);

router.post("/updateInfo", UserInfoController.updateInfo);

router.post('/getInfo', UserInfoController.getInfo);

module.exports = router;