const HistorychatController = require('../controllers/historychatController');
let express = require('express');
let router = express.Router();

router.post("/saveMsg", HistorychatController.saveMsg);

router.post("/loadHistory", HistorychatController.loadHistory);

module.exports = router;