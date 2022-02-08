
module.exports = mongoose => {
    var schema = mongoose.Schema({
        create_date: Date,
        userId: String,
        rating: Number,
        feedback: String,
        status: Number
    }, { timestamps: true });

    schema.index({ tieu_de: 'text', 'profile.something': 'text' });

    const Feedback = mongoose.model("Feedback", schema, 'Feedback');
    return Feedback;

};