



module.exports = mongoose => {
    var Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    var schema = mongoose.Schema({
        noi_dung: String,
        status: Number,
        answer: String,
        percent: Number,
        create_date: Date
    });
    
    const Infonotfound = mongoose.model("Infonotfound", schema, 'Infonotfound');
    return Infonotfound;

};