const db = require("../models");
const Feedback = db.Feedback;

exports.saveFeedback = async (req, res, next) => {
    try {
        const data = req.body;
        console.log(data)
        let date_ob = new Date();
        const feedback = new Feedback({
            "feedback": data.feedback,
            "create_date": date_ob,
            "userId": data.userId,
            "rating": data.rating,
            "status": 1
        });
        feedback
            .save(feedback)
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