const db = require("../models");
const Thong_tin_y_te_khac = db.Thong_tin_y_te_khac;
const public_func = require("../share/public_func");


exports.searchbyName = async(req, res) => {
    try {
        var name = req.query.name;

        var data;
        if (name) {
            data = await Thong_tin_y_te_khac
                .find({$text: {$search: name}})
            
            res.status(200).json({
                "data" : data,
                "value": name,
                "message": "Successfull"
            });
        }
        else
        {
            res.status(400).json({ "message": "Bad Request" });
        }

    } catch (error) {
        res.status(500).json({ "message": "Server Error" });
        console.log(error);
    }

};