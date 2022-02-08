const db = require("../models");
const UserInfo = db.UserInfo;

exports.register = async (req, res, next) => {
    try {
        const data = req.body;
        let date_ob = new Date();
        const userInfo = new UserInfo({
            "create_date": date_ob,
            "userId": data.userId,
            "email": data.email,
            "displayName": data.displayName,
            "phoneNumber": "",
            "fullName": "",
            "birthday": date_ob.valueOf(),
            "status": 1
        });
        userInfo
            .save(userInfo)
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

exports.updateInfo = async (req, res, next) => {
    try {
        const data = req.body;
        const userInfo = await UserInfo.findOneAndUpdate({ userId: data.userId }, data, {
            new: true
        })
        console.log(userInfo);
        res.status(200).json({
            message: "Successful updated"
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.getInfo = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const user = await UserInfo.findOne({ userId });
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        next(error);
    }
}