
const axios = require('axios').default;
const serverUrl = 'https://50c7-2402-800-63a9-bb85-946d-2f9a-9f71-7291.ngrok.io/knn_get_ill';

exports.diagnose = async (list_symptom) => {
    const result = {
        msg: '',
        content: undefined
    }
    var noi_dung = "";
    console.log(list_symptom);
    list_symptom.forEach(item => noi_dung += item + ', ')
    console.log(noi_dung);
    const res = await axios.post(serverUrl, { noi_dung });
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
}