const dbConfig = require("../config/dbConfig");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.illness = require("./illness")(mongoose);
db.Thong_tin_y_te_khac = require("./Thong_tin_y_te_khac")(mongoose);
module.exports = db;
