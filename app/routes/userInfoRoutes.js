const UserInfoController = require('../controllers/userInfoController');
let express = require('express');
let router = express.Router();

router.post("/register", UserInfoController.register);

router.post("/updateInfo", UserInfoController.updateInfo);

router.get('/getInfo', UserInfoController.getInfo);

module.exports = router;