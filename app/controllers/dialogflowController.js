// import { getIllByName } from './illnessController';
const { format } = require('express/lib/response');
const IllnessController = require('./illnessController');
const diagnoseMiddleware = require('./diagnoseController');
const unknownController = require('./unknownController');
const acceptConfident = 0.55;
exports.getMsg = async (req, res, next) => {
    try {
        const queryResult = req.body.queryResult;
        console.log(queryResult);
        const intent = queryResult.intent.displayName;
        var result = undefined;
        switch (intent) {
            case 'xac_nhan':
                result = await confirm_route(queryResult, res, next);
                break;
            case 'phu_nhan':
                result = await deny_route(queryResult, res, next);
                break;
            case 'chan_doan_benh':
                result = await diagnose(queryResult, res, next);
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
        console.log(error);
        next(error);
    }
}

async function diagnose(queryResult, res, next) {
    try {
        const result = respondResult;
        const list_ill_res = await diagnoseMiddleware.diagnose(queryResult.queryText);
        if (list_ill_res == null)
            throw new Error();
        result.fulfillmentMessages[0].text.text = [list_ill_res.msg];
        result.fulfillmentMessages[1].payload.content = list_ill_res.content;
        return result;
    } catch (error) {
        next(error);
    }
}

async function search(queryResult, res, next) {
    try {
        const result = respondResult;
        result.fulfillmentMessages[0].text.text = ["Search other info"];
        result.fulfillmentMessages[1].payload.content = undefined;
        return result;
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function illness_info_route(queryResult, res, next) {
    console.log('Illness info route');
    try {
        // console.log(queryResult);
        const attr = queryResult.intent.displayName;
        const illName = queryResult.parameters.benh;
        const confident = queryResult.intentDetectionConfidence;
        const context = queryResult.outputContexts[0];

        var result = respondResult;
        if (confident < acceptConfident) {
            const msg = 'Có phải bạn đang tra cứu thông tin về ' + attrDescript[attr].toLowerCase() + ' của ' + illName.toLowerCase();
            result.fulfillmentMessages[0].text.text = [msg];
            result.fulfillmentMessages[1].payload.content = undefined;
            context.parameters.isConfirm = true;
            context.parameters.confirmText = queryResult.queryText;
        }
        else {
            result = await get_illness_infor(attr, illName, queryResult.queryText);
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
        if (confident < acceptConfident) {
            const msg = 'Có phải bạn đang tra cứu thông tin về ' + attrDescript[attr].toLowerCase() + ' của ' + illName.toLowerCase();
            result.fulfillmentMessages[0].text.text = [msg];
            result.fulfillmentMessages[1].payload.content = undefined;
            context.parameters.isConfirm = true;
            context.parameters.confirmText = queryResult.queryText;
        }
        else {
            result = await get_illness_infor(attr, illName, queryResult.queryText);
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
        if (confident < acceptConfident) {
            // console.log('Flag if');
            const msg = 'Có phải bạn đang tra cứu thông tin về ' + attrDescript[attr].toLowerCase() + ' của ' + illName.toLowerCase();
            result.fulfillmentMessages[0].text.text = [msg];
            result.fulfillmentMessages[1].payload.content = undefined;
            context.parameters.isConfirm = true;
            context.parameters.confirmText = queryResult.queryText;
        }
        else {
            // console.log('Flag else');
            result = await get_illness_infor(attr, illName, queryResult.queryText);
        }
        context.parameters.thuoc_tinh = attr;
        result.outputContexts = [context];
        return result;
    } catch (error) {
        next(error);
    }
}

async function deny_route(queryResult, res, next) {
    try {
        console.log("deny route")
        const attr = queryResult.outputContexts[0].parameters.thuoc_tinh;
        const illName = queryResult.outputContexts[0].parameters.benh;
        const confident = queryResult.intentDetectionConfidence;
        const isConfirm = queryResult.outputContexts[0].parameters.isConfirm;
        const queryText = queryResult.outputContexts[0].parameters.queryText;
        const context = queryResult.outputContexts[0];
        var result = respondResult;
        result.fulfillmentMessages[1].payload.content = undefined;

        if (!isConfirm) {
            const msg = 'Xin lỗi bạn nói gì tôi không hiểu...';
            result.fulfillmentMessages[0].text.text = [msg];
            return result;
        }

        // var result = respondResult;
        if (confident < acceptConfident) {
            return search(queryResult, res, next);
        }
        else {
            const msg = 'Xin lỗi vì sự bất tiện này, xin vui lòng nhập lại câu hỏi theo cách dễ hiểu hơn!';
            result.fulfillmentMessages[0].text.text = [msg];
            context.parameters.isConfirm = false;
            result.outputContexts = [context];
            unknownController.save(queryText);
        }
        return result;

    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function confirm_route(queryResult, res, next) {
    try {
        console.log("confirm route")
        const attr = queryResult.outputContexts[0].parameters.thuoc_tinh;
        const illName = queryResult.outputContexts[0].parameters.benh;
        const confident = queryResult.intentDetectionConfidence;
        const isConfirm = queryResult.outputContexts[0].parameters.isConfirm;
        const context = queryResult.outputContexts[0]
        var result = respondResult;
        if (!isConfirm) {
            const msg = 'Xin cảm ơn bạn! Mình rất vui vì đã giúp ích cho bạn.';
            result.fulfillmentMessages[0].text.text = [msg];
            result.fulfillmentMessages[1].payload.content = undefined;
            return result;
        }

        // var result = respondResult;
        if (confident < acceptConfident) {
            return search(queryResult, res, next);
        }
        else {
            result = await get_illness_infor(attr, illName, queryResult.queryText);
            context.parameters.isConfirm = false;
            result.outputContexts = [context];
        }
        return result;

    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function get_illness_infor(attr, illName, queryText) {
    console.log('Get ' + illName + ' info with ' + attr);
    const ill = await IllnessController.getIllByName(illName);
    const result = respondResult;
    var msg = '';
    var content = undefined;

    // console.log(ill);
    if (ill == null) {
        msg = 'Xin lỗi chúng tôi không có thông tin của ' + illName.toLowerCase();
        unknownController.save(queryText);
    }
    else {
        const infor = ill[attr];
        const suggest = getSuggest(ill, attr);
        if (infor.length == 0) {
            msg = 'Xin lỗi chúng tôi không có thông tin ' + attrDescript[attr].toLowerCase() + ' của bệnh ' + illName.toLowerCase();
            if (suggest.length != 0)
                content = suggest;
            unknownController.save(queryText);
        }
        else {
            msg = attrDescript[attr] + ' của ' + illName.toLowerCase();
            content = infor[0].noi_dung;
            content = content.concat(suggest);
        }
    }
    result.fulfillmentMessages[0].text.text = [msg];
    result.fulfillmentMessages[1].payload.content = content;
    // console.log(result.fulfillmentMessages);
    return result;
}

exports.test = async (req, res) => {
    const illInfo = await IllnessController.getIllByName('viêm đại tràng');
    const suggest = getSuggest(illInfo);
    res.send(JSON.stringify(suggest));
}

function getSuggest(ill, current_attr) {
    const result = [];
    attr.forEach(item => {
        const info = ill[item];
        if (info != undefined && info.length != 0 && item != current_attr) {
            result.push({
                type: 'link',
                content: attrDescript[item]
            })
        }
    })
    const illName = ill.ten_benh;
    if (result.length != 0) {
        const suggestTitle = {
            type: 'suggest',
            content: `Thông tin liên quan đến ${illName}: `
        }
        return [suggestTitle].concat(result);
    }
    return [];
}


const attrDescript = {
    'tong_quan': 'Tổng quan',
    'trieu_chung': 'Triệu chứng',
    'cach_dieu_tri': 'Cách điều trị',
    'bien_chung': 'Biến chứng',
    'bien_phap_chuan_doan': 'Biện pháp chẩn đoán',
    'cach_phong_ngua': 'Cách phòng ngừa',
    'doi_tuong_mac_benh': 'Đối tượng mắc bệnh',
    'duong_lay_truyen': 'Đường lây truyền',
    'nguyen_nhan': 'Nguyên nhân',
}

const attr = ['tong_quan', 'trieu_chung', 'cach_dieu_tri', 'bien_chung', 'bien_phap_chuan_doan', 'cach_phong_ngua', 'doi_tuong_mac_benh', 'duong_lay_truyen', 'nguyen_nhan']

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
                content: undefined,
                // Your custom fields payload
            }
        }
    ],
    // outputContexts: unde
}