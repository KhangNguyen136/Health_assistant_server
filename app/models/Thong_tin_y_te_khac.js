
    /**
     * @openapi
     * components:
     *  schemas:
     *    Thong tin y te khac:
     *      type: object
     *      properties:
     *        tieu_de:
     *          type: string
     *        noi_dung:
     *          type: array
     *          items:
     *            type: object
     *            properties:
     *              type:
     *                type: string
     *              content:
     *                type: string
     *        link_web:
     *          type: string
     *        id_web:
     *          type: objectid
     *        create_date:
     *          type: string
     *          format: date-time
     *        update_date:
     *          type: string
     *          format: date-time
     *        create_user:
     *          type: objectid
     *        update_user:
     *          type: objectid
     *        id_benh:
     *          type: objectid
     */

module.exports = mongoose => {
    var Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    var schema = mongoose.Schema({
        tieu_de: String,
        noi_dung: [{}],
        link_web: String,
        id_web: ObjectId,
        create_date: Date,
        update_date: Date,
        create_user: ObjectId,
        update_user: ObjectId,
        status: Number,
        id_benh: ObjectId,
    }, { timestamps: true });

    schema.index({tieu_de: 'text', 'profile.something': 'text'});
    const Thong_tin_y_te_khac = mongoose.model("Thong_tin_y_te_khac", schema, 'Thong_tin_y_te_khac');
    return Thong_tin_y_te_khac;

};