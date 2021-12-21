// import { getIllByName } from './illnessController';
const IllnessController = require('./illnessController');

exports.getMsg = async (req, res, next) => {
    try {
        const queryResult = req.body.queryResult;
        // console.log(queryResult);
        const intent = queryResult.intent.displayName;
        var result = undefined;
        switch (intent) {
            case 'xac_nhan':
                result = await confirm_route(queryResult, res, next);
                break;
            case 'phu_nhan':
                result = await negate_route(queryResult, res, next);
                break;
            case 'tra_cuu':
                result = await search(queryResult, res, next);
                break;
            case 'doi_benh':
                result = await change_ill_route(queryResult, res, next);
                break;
            case 'doi_thuoc_tinh':
                result = await change_attr_route(queryResult, res, next);
                break;
            default:
                result = await illness_info_route(queryResult, res, next);
                // console.log('Illness infor with ' + queryResult.toString());
                break;
        }
        res.send(JSON.stringify(result));

    } catch (error) {
        next(error);
    }
}

async function search(queryResult, res, next) {
    try {
        const result = respondResult;
        var msg
        msg = 'Tra cứu thông tin khác: ' + queryResult.queryText;
        result.fulfillmentMessages[0].text.text = [msg];
        result.fulfillmentMessages[1].payload.content = [];
        return result;
    } catch (error) {
        next(error);
    }
}

async function illness_info_route(queryResult, res, next) {
    console.log('Illness info route');
    try {
        const attr = queryResult.intent.displayName;
        const illName = queryResult.parameters.benh;
        const confident = queryResult.intentDetectionConfidence;
        const context = queryResult.outputContexts[0];

        var result = respondResult;
        if (confident < 0.65) {
            msg = 'Có phải bạn đang tra cứu thông tin về ' + attrDescript[attr].toLowerCase() + ' của ' + illName.toLowerCase();
            result.fulfillmentMessages[0].text.text = [msg];
            // context.parameters.isConfirm = true;
        }
        else {
            result = await get_illness_infor(attr, illName);
        }
        // context.parameters.intent = attr;
        context.parameters.thuoc_tinh = attr;
        result.outputContexts = [context];
        return result;
    } catch (error) {
        next(error);
    }
}

async function change_ill_route(queryResult, res, next) {
    console.log('Change ill route');

    try {
        const illName = queryResult.parameters.benh;
        const attr = queryResult.outputContexts[0].parameters.thuoc_tinh;
        const confident = queryResult.intentDetectionConfidence;
        const context = queryResult.outputContexts[0];

        var result = respondResult;
        if (confident < 0.65) {
            msg = 'Có phải bạn đang tra cứu thông tin về ' + attrDescript[attr].toLowerCase() + ' của ' + illName.toLowerCase();
            result.fulfillmentMessages[0].text.text = [msg];
            result.fulfillmentMessages[1].payload.content = [];
            // context.parameters.isConfirm = true;
        }
        else {
            result = await get_illness_infor(attr, illName);
        }
        context.parameters.benh = illName;
        result.outputContexts = [context];
        return result;
    } catch (error) {
        next(error);
    }
}

async function change_attr_route(queryResult, res, next) {
    console.log('Change attr route');
    try {
        const attr = queryResult.parameters.thuoc_tinh;
        const confident = queryResult.intentDetectionConfidence;
        const context = queryResult.outputContexts[0];
        const illName = context.parameters.benh;

        var result = respondResult;
        if (confident < 2) {
            console.log('Flag if');
            msg = 'Có phải bạn đang tra cứu thông tin về ' + attrDescript[attr].toLowerCase() + ' của ' + illName.toLowerCase();
            result.fulfillmentMessages[1].payload.content = [];
            // context.parameters.isConfirm = true;
        }
        else {
            console.log('Flag else');
            result = await get_illness_infor(attr, illName);
        }
        context.parameters.thuoc_tinh = attr;
        result.outputContexts = [context];
        return result;
    } catch (error) {
        next(error);
    }
}

async function confirm_route(queryResult, res, next) {
    try {
        const attr = queryResult.outputContexts[0].parameters.thuoc_tinh;
        const illName = queryResult.outputContexts[0].parameters.benh;
        const confident = queryResult.intentDetectionConfidence;
        // const context = queryResult.outputContexts[0];

        var result = respondResult;
        if (confident < 0.65) {
            return search(queryResult, res, next);
        }
        else {
            result = await get_illness_infor(attr, illName);
        }
        return result;

    } catch (error) {
        next(error);
    }
}

async function get_illness_infor(attr, illName) {
    console.log('Get ' + illName + ' info with ' + attr);
    const ill = await IllnessController.getIllByName(illName);
    const result = respondResult;
    var msg = '';
    var content = undefined;

    // console.log(ill);
    if (ill == null) {
    }
    else {
        const infor = ill[attr];
        if (infor.length == 0) {
            msg = 'Xin lỗi chúng tôi không có thông tin ' + attrDescript[attr].toLowerCase() + ' của bệnh ' + illName.toLowerCase();
        }
        else {
            msg = attrDescript[attr] + ' bệnh ' + illName.toLowerCase();
            content = infor[0].noi_dung;
        }
    }
    result.fulfillmentMessages[0].text.text = [msg];
    result.fulfillmentMessages[1].payload.content = content;
    // console.log(result.fulfillmentMessages);
    return result;
}

exports.test = async (req, res) => {
    // console.log(req);
    const illInfo = await IllnessController.getIllByName('viêm đại tràng');
    // console.log(illInfo['nguyen_nhan']);
    // console.log(illInfo);
    res.send(JSON.stringify(illInfo));
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
    ],
    outputContexts: []
}