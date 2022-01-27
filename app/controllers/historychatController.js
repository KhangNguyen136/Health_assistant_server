const db = require("../models");
const Historychat = db.Historychat;

exports.create = async(id_user, ask, answer) => {
    if (!id_user || !ask || !answer) {
        return 0;
    }
    let date_ob = new Date();
    const history = new Historychat({
        "ask" : ask,
        "answer": answer,
        "create_date": date_ob,
        "create_user": id_user,
        "status": 1
    });
    history
    .save(history)
    .then(data => {
        return 1
    })
    .catch(err => {
        console.log(err.message)
        return 0
    });
};

exports.readhistory = async(id_user, num) => {
    if (id_user == null || num == null) {
        return 0;
    }
    try {
        var data = await Historychat
                    .find({create_user: id_user})
                    .sort({ create_date: 'desc' })
                    .limit(15)
                    .skip(parseInt(num));
    return data
    } catch (error) {
        return 0
    }
    

};