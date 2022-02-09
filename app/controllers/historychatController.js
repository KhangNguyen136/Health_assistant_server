const db = require("../models");
const Historychat = db.Historychat;

exports.saveMsg = async (req, res, next) => {
    try {
        const data = req.body;
        console.log(req.body)
        let date_ob = new Date();
        const history = new Historychat({
            "msg": data.msg,
            "create_date": date_ob,
            "userId": data.userId,
            "status": 1
        });
        history
            .save(history)
            .then(data => {
                res.status(200).json({
                    message: "Successful saved"
                })
            })
            .catch(err => {
                throw err;
            });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.loadHistory = async (req, res, next) => {
    try {
        const params = req.body;
        console.log(req.body);
        var data = await Historychat
            .find({ userId: params.userId, status:1 })
            .sort({ create_date: 'desc' })
            .limit(30)
            .skip(params.currentN)

        res.status(200).json({
            data
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.deleteHistory = async (req, res, next) => {
    try {
        const params = req.body;
        console.log(req.body);

        Historychat.updateOne(
            {_id: params.id},
            {
                $set: {
                    status: 0
                }
            }
        )
        res.status(200).json({
            message:"Thanh cong"
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
};