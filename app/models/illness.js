

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
            trieu_chung: String,
            thoi_gian: String
        }],
        create_date: Date,
        update_date: Date,
        create_user: ObjectId,
        update_user: ObjectId,
        status: Number
    }, { timestamps: true });

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Illness = mongoose.model("benhs", schema);
    return Illness;
};