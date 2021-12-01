module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            // _id: String,
            name: String
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Illness = mongoose.model("illness", schema);
    return Illness;
};
