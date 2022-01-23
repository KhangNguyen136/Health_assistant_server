const db = require("../models");
const Historychat = db.Historychat;
const public_func = require("../share/public_func");

exports.create = async(id_user, ask, answer) => {
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
        console.log(data)
        // res.send(data);
    })
    .catch(err => {
        console.log(err.message)
        // res.status(500).send({
        //     message: err.message || "Some error occurred while creating the illness."
        // });
    });
};