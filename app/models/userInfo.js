module.exports = mongoose => {
    var schema = mongoose.Schema({
        create_date: Date,
        userId: String,
        displayName: String,
        fullName: String,
        email: String,
        phoneNumber: String,
        birthday: Number,
        status: Number
    }, { timestamps: true });

    // schema.index({ tieu_de: 'text', 'profile.something': 'text' });

    const UserInfo = mongoose.model("UserInfo", schema, 'UserInfo');
    return UserInfo;

};