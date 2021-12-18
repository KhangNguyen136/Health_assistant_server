// import { getIllByName } from './illnessController';
const IllnessController = require('./illnessController');

exports.getMsg = (req, res, next) => {
    try {
        const queryResult = req.body.queryResult;
        // console.log(queryResult);
        const intent = queryResult.intent.displayName;
        switch (intent) {
            case 'tra_cuu':
                search(queryResult, res, next);
                break;
            case 'doi_benh':
                change_ill_route(queryResult, res, next);
                break;
            case 'doi_thuoc_tinh':
                change_attr_route(queryResult, res, next);
                break;
            default:
                illness_info_route(queryResult, res, next);
                // console.log('Illness infor with ' + queryResult.toString());
                break;
        }
    } catch (error) {
        next(error);
    }
}

async function search(queryResult, res, next) {
    try {
        const result = respondResult;
        var msg
        msg = '(From back-end)\n Tra cứu thông tin khác: ' + queryResult.queryText;
        // const search_result = search_with_text(queryResult.queryText);
        // if (search_result != null) {
        //     result.fulfillmentMessages[1].payload.content = search_result;
        // }
        result.fulfillmentMessages[0].text.text = [msg];
        res.send(JSON.stringify(result));
    } catch (error) {
        next(error);
    }
}

async function illness_info_route(queryResult, res, next) {
    try {
        const attr = queryResult.intent.displayName;
        const illName = queryResult.parameters.benh;
        const confident = queryResult.intentDetectionConfidence;
        var result = respondResult;
        if (confident < 0.65) {
            msg = 'Có phải bạn đang tra cứu thông tin về ' + attrDescript[attr].toLowerCase() + 'của bệnh ' + illName.toLowerCase();
            result.fulfillmentMessages[0].text.text = [msg];
        }
        else {
            result = await get_illness_infor(attr, illName);
        }
        res.send(JSON.stringify(result));
    } catch (error) {
        next(error);
    }
}

async function change_ill_route(queryResult, res, next) {
    try {
        const illName = queryResult.parameters.benh;
        const attr = queryResult.outputContexts[0].parameters.thuoc_tinh;
        const confident = queryResult.intentDetectionConfidence;
        var result = respondResult;
        if (confident < 0.65) {
            msg = 'Có phải bạn đang tra cứu thông tin về ' + attrDescript[attr].toLowerCase() + 'của bệnh ' + illName.toLowerCase();
            result.fulfillmentMessages[0].text.text = [msg];
        }
        else {
            result = await get_illness_infor(attr, illName);
        }
        res.send(JSON.stringify(result));
    } catch (error) {
        next(error);
    }
}

async function change_attr_route(queryResult, res, next) {
    try {
        const attr = queryResult.parameters.thuoc_tinh;
        const illName = queryResult.outputContexts[0].parameters.benh;
        const confident = queryResult.intentDetectionConfidence;
        var result = respondResult;
        if (confident < 0.65) {
            msg = 'Có phải bạn đang tra cứu thông tin về ' + attrDescript[attr].toLowerCase() + 'của bệnh ' + illName.toLowerCase();
            result.fulfillmentMessages[0].text.text = [msg];
        }
        else {
            result = await get_illness_infor(attr, illName);
        }
        res.send(JSON.stringify(result));
    } catch (error) {
        next(error);
    }
}

async function get_illness_infor(attr, illName) {
    const ill = await IllnessController.getIllByName(illName);
    const result = respondResult;
    var msg = '';
    var content = undefined;

    // console.log(ill);
    if (ill == null) {
        msg = 'Xin lỗi chúng tôi không có thông tin của bệnh này'
        // content.push({
        //     type: 's',
        //     content: 'Xin lỗi chúng tôi không có thông tin của bệnh này'
        // })
    }
    else {
        const infor = ill[attr];
        if (infor.length == 0) {
            msg = 'Xin lỗi chúng tôi không có thông tin ' + attrDescript[attr].toLowerCase() + ' của bệnh ' + illName.toLowerCase();
            // content.push({
            //     type: 's',
            //     content: msg
            // })
        }
        else {
            msg = attrDescript[attr] + ' bệnh ' + illName.toLowerCase();
            content = infor[0].noi_dung;
        }
    }
    result.fulfillmentMessages[0].text.text = [msg];
    result.fulfillmentMessages[1].payload.content = content;
    console.log(result.fulfillmentMessages);
    return result;
}

exports.test = async (req, res) => {
    // console.log(req);
    const illInfo = await IllnessController.getIllByName('rối loạn tiền đình');
    console.log(illInfo['nguyen_nhan']);
    res.send(JSON.stringify(illInfo))
}

const attrDescript = {
    'tong_quan': 'Tổng quan',
    'trieu_chung': 'Triệu chứng',
    'cach_dieu_tri': 'Cách điều trị',
    'bien_chung': 'Biến chứng',
    'bien_phap_chan_doan': 'Biện pháp chẩn đoán',
    'cach_phong_ngua': 'Cách phòng ngừa',
    'doi_tuong_mac_benh': 'Đối tượng mắc bệnh',
    'duong_lay_truyen': 'Đường lây truyền',
    'nguyen_nhan': 'Nguyên nhân',
}

const respondResult = {
    // fulfillmentText: '',
    fulfillmentMessages: [
        {
            // this item is optional
            text: {
                text: []
            }
        },
        {
            payload: {
                content: [],
                // Your custom fields payload
            }
        }
    ]
}