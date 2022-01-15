const db = require("../models");
const Thong_tin_y_te_khac = db.Thong_tin_y_te_khac;
const public_func = require("../share/public_func");


exports.searchbyName = async(req, res) => {
    try {
        var name = req.query.name;

        var data;
        if (!name) {
            data = await Thong_tin_y_te_khac
                .find()
        }
        console.log(data)
        res.status(200).json({
            "data" : data,
            "value": name,
            "message": "Successfull"
        });
    } catch (error) {
        res.status(500).json({ "message": "Server Error" });
        console.log(error);
    }

};