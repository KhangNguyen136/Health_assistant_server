
    /**
     * @openapi
     * components:
     *  schemas:
     *    Illness:
     *      type: object
     *      properties:
     *        ten_benh:
     *          type: string
     *        create_date:
     *          type: string
     *          format: date-time
     *        update_date:
     *          type: string
     *          format: date-time
     *        create_user:
     *          type: string
     *        update_user:
     *          type: string
     *        trieu_chung:
     *          type: array
     *          items:
     *            $ref: "#/components/schemas/thongtin"
     *        nguyen_nhan:
     *          type: array
     *          items:
     *            $ref: "#/components/schemas/thongtin"
     *        tong_quan:
     *          type: array
     *          items:
     *            $ref: "#/components/schemas/thongtin"
     *        cach_dieu_tri:
     *          type: array
     *          items:
     *            $ref: "#/components/schemas/thongtin"
     *        cach_phong_ngua:
     *          type: array
     *          items:
     *            $ref: "#/components/schemas/thongtin"
     *        doi_tuong_mac_benh:
     *          type: array
     *          items:
     *            $ref: "#/components/schemas/thongtin"
     *        bien_phap_chuan_doan:
     *          type: array
     *          items:
     *            $ref: "#/components/schemas/thongtin"
     *        duong_lay_truyen:
     *          type: array
     *          items:
     *            $ref: "#/components/schemas/thongtin"
     *        bien_chung:
     *          type: array
     *          items:
     *            $ref: "#/components/schemas/thongtin"
     *        danh_sach_trieu_chung:
     *          type: array
     *          items:
     *            $ref: "#/components/schemas/thongtin_trieuchung"
     *        status:
     *          type: integer
     *    thongtin:
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
     *        do_uu_tien:
     *          type: integer
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
     *    thongtin_trieuchung:
     *      type: object
     *      properties:
     *        type:
     *          type: string
     *        content:
     *          type: string
     *        point:
     *          type: integer
     */

module.exports = mongoose => {
    var Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    var schema = mongoose.Schema({
        ten_benh: String,
        trieu_chung: [{
            tieu_de: String,
            noi_dung: [{}],
            link_web: String,
            create_date: Date,
            update_date: Date,
            create_user: ObjectId,
            update_user: ObjectId,
            do_uu_tien: Number,
            status: Number,
        }],
        nguyen_nhan: [{
            tieu_de: String,
            noi_dung: [{}],
            link_web: String,
            create_date: Date,
            update_date: Date,
            create_user: ObjectId,
            update_user: ObjectId,
            do_uu_tien: Number,
            status: Number,
        }],
        tong_quan: [{
            tieu_de: String,
            noi_dung: [{}],
            link_web: String,
            create_date: Date,
            update_date: Date,
            create_user: ObjectId,
            update_user: ObjectId,
            do_uu_tien: Number,
            status: Number,
        }],
        cach_dieu_tri: [{
            tieu_de: String,
            noi_dung: [{}],
            link_web: String,
            create_date: Date,
            update_date: Date,
            create_user: ObjectId,
            update_user: ObjectId,
            do_uu_tien: Number,
            status: Number,
        }],
        cach_phong_ngua: [{
            tieu_de: String,
            noi_dung: [{}],
            link_web: String,
            create_date: Date,
            update_date: Date,
            create_user: ObjectId,
            update_user: ObjectId,
            do_uu_tien: Number,
            status: Number,
        }],
        doi_tuong_mac_benh: [{
            tieu_de: String,
            noi_dung: [{}],
            link_web: String,
            create_date: Date,
            update_date: Date,
            create_user: ObjectId,
            update_user: ObjectId,
            do_uu_tien: Number,
            status: Number,
        }],
        bien_phap_chuan_doan: [{
            tieu_de: String,
            noi_dung: [{}],
            link_web: String,
            create_date: Date,
            update_date: Date,
            create_user: ObjectId,
            update_user: ObjectId,
            do_uu_tien: Number,
            status: Number,
        }],
        duong_lay_truyen: [{
            tieu_de: String,
            noi_dung: [{}],
            link_web: String,
            create_date: Date,
            update_date: Date,
            create_user: ObjectId,
            update_user: ObjectId,
            do_uu_tien: Number,
            status: Number,
        }],
        bien_chung: [{
            tieu_de: String,
            noi_dung: [{}],
            link_web: String,
            create_date: Date,
            update_date: Date,
            create_user: ObjectId,
            update_user: ObjectId,
            do_uu_tien: Number,
            status: Number,
        }],
        danh_sach_trieu_chung: [{
        }],
        create_date: Date,
        update_date: Date,
        create_user: ObjectId,
        update_user: ObjectId,
        status: Number
    });


    const Illness = mongoose.model("Benh", schema, 'Benh');
    return Illness;

};