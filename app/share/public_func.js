exports.getPage = async(page, total_rows, records_per_page) => {
    try {
        var paging_arr = [];
        var total_pages = total_rows / records_per_page;
        if ((total_rows % records_per_page) > 0) {
            total_pages += 1;
        }
        const range = 3;
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