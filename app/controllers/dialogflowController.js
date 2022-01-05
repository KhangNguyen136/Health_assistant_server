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
        next(error);
    }
}

async function diagnose(queryResult, res, next) {
    try {
        const result = respondResult;
        const list_symptom = queryResult.parameters.trieu_chung;
        // const list_ill = diagnoseMiddleware(list_symptom);
        // if (list_ill.length == 0) {
        //     const msg = 'Xin loi chung toi khon.....'
        //     result.fulfillmentMessages[0].text.text = [msg];
        //     result.fulfillmentMessages[1].payload.content = undefined;
        //     return result
        // }
        // const content = [];
        // list_ill.forEach(item => {
        //     content.push({
        //         type: 'suggest',
        //         content: item,
        //     })
        // })
        var msg = 'Danh sách các triệu chứng: ';
        list_symptom.forEach(item =>
            msg += `${item}, `)
        result.fulfillmentMessages[0].text.text = [msg];
        result.fulfillmentMessages[1].payload.content = undefined;
        return result;
    } catch (error) {
        next(error);
    }
}

async function search(queryResult, res, next) {
    try {
        const queryText = queryResult.queryText
        const result = respondResult;
        // var msg
        // var content
        // const search_result = search_in_DB(queryText);
        // if (search_result.length == 0) {
        //     //unknow
        //     msg = 'Xin lỗi chúng tôi không có thông tin của ' + illName.toLowerCase();
        //     content = undefined;
        //     unknownController.save(queryText);
        // }
        // else {
        //     msg = queryText;
        //     content = search_result;
        // }
        result.fulfillmentMessages[0].text.text = ['Tra cứu thông tin khác: ' + queryText];
        result.fulfillmentMessages[1].payload.content = undefined;
        return result;
    } catch (error) {
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
        if (infor.length == 0) {
            msg = 'Xin lỗi chúng tôi không có thông tin ' + attrDescript[attr].toLowerCase() + ' của bệnh ' + illName.toLowerCase();
            unknownController.save(queryText);
        }
        else {
            msg = attrDescript[attr] + ' của ' + illName.toLowerCase();
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
    const illInfo = await IllnessController.getIllByName('viêm đại');
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
                content: undefined,
                // Your custom fields payload
            }
        }
    ],
    // outputContexts: unde
}