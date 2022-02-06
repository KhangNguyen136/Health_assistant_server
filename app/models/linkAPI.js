module.exports = mongoose => {
    var Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    var schema = mongoose.Schema({
        link: String
    });

    const LinkAPI = mongoose.model("LinkAPI", schema, 'LinkAPI');
    return LinkAPI;

};