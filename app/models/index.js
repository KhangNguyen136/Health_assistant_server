const dbConfig = require("../config/dbConfig");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.illness = require("./illness")(mongoose);
db.orderimfomation = require("./orderimfomation")(mongoose);
db.Historychat = require("./historychat")(mongoose);
db.LinkAPI = require("./linkAPI")(mongoose);
module.exports = db;
