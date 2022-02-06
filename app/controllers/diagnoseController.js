
const axios = require('axios').default;
const public_func = require("../share/public_func");

exports.diagnose = async (list_symptom) => {
    try {
        const link = await public_func.getlinkAPI();
        console.log(link);
        const result = {
            msg: '',
            content: undefined
        }
        var noi_dung = "";
        console.log(list_symptom);
        list_symptom.forEach(item => noi_dung += item + ', ')
        console.log(noi_dung);
        const res = await axios.post(link + '/knn_get_ill', { noi_dung });
        const data = res.data.data;
        console.log(data);
        if (data.length == 0) {
            result.msg = 'Xin lỗi chúng tôi không có kết quả nào phù hớp với những triệu chứng của bạn đưa ra.'
        }
        else {
            result.msg = 'Bạn có thể mắc những căn bệnh sau đây: ';
            result.content = [];
            data.forEach(item =>
                result.content.push({
                    type: 'link',
                    content: item
                }))
        }
        return result;
    } catch (error) {
        console.log(error)
        return null;
    }

}