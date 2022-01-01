exports.getPage = async (page, total_rows, records_per_page) => {
    try {
        var paging_arr = [];
        var total_pages = total_rows / records_per_page;
        if ((total_rows % records_per_page) > 0) {
            total_pages += 1;
        }
        const range = 2;
        var initial_num = page - range;
        var condition_limit_num = (parseInt(page) + parseInt(range) + 1);
        var page_count = 0;
        for (let index = initial_num; index < condition_limit_num; index++) {
            if ((index > 0) && (index <= total_pages)) {
                var paging_arr_temp = {
                    "page": index,
                    "current_page": "no"
                };
                if (index == page) {
                    paging_arr_temp["current_page"] = "yes"
                }
                paging_arr.push(paging_arr_temp);
                page_count++;
            }

        }
        return paging_arr;
    } catch (error) {
        return null;
    }


};

function get_top_TT(thongtin) {
    if (thongtin.length < 1) {
        return new Array();
    } else {
        min = 10000;
        var out = new Object();
        for (var i = 0; i < thongtin.length; i++) {
            if (thongtin[i]["do_uu_tien"] < min) {
                min = thongtin[i]["do_uu_tien"];
                out = thongtin[i];
            }
        }
        return out;
    }
}


exports.getillinfomation = async (listbenh) => {
    console.log(listbenh);
    try {
        var outdata = new Array();
        var benh = new Object();
        if (listbenh.length < 1) {
            return null;
        } else {
            for (let i = 0; i < listbenh.length; i++) {

                benh = listbenh[i];
                // console.log(benh["ten_benh"])
                benh["trieu_chung"] = get_top_TT(benh["trieu_chung"]);
                // console.log(benh["trieu_chung"])
                benh["nguyen_nhan"] = get_top_TT(benh["nguyen_nhan"]);
                benh["tong_quan"] = get_top_TT(benh["tong_quan"]);
                benh["cach_dieu_tri"] = get_top_TT(benh["cach_dieu_tri"]);
                benh["cach_phong_ngua"] = get_top_TT(benh["cach_phong_ngua"]);
                benh["doi_tuong_mac_benh"] = get_top_TT(benh["doi_tuong_mac_benh"]);
                benh["bien_phap_chuan_doan"] = get_top_TT(benh["bien_phap_chuan_doan"]);
                benh["duong_lay_truyen"] = get_top_TT(benh["duong_lay_truyen"]);
                benh["bien_chung"] = get_top_TT(benh["bien_chung"]);
                outdata.push(benh);
            }
            // console.log(outdata)
            return outdata;
        }
    } catch (error) {
        return null;
    }



}