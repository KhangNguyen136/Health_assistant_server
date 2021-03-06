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
            const msg = 'C?? ph???i b???n ??ang tra c???u th??ng tin v??? ' + attrDescript[attr].toLowerCase() + ' c???a ' + illName.toLowerCase();
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
            const msg = 'C?? ph???i b???n ??ang tra c???u th??ng tin v??? ' + attrDescript[attr].toLowerCase() + ' c???a ' + illName.toLowerCase();
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
            const msg = 'C?? ph???i b???n ??ang tra c???u th??ng tin v??? ' + attrDescript[attr].toLowerCase() + ' c???a ' + illName.toLowerCase();
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
            const msg = 'Xin l???i b???n n??i g?? t??i kh??ng hi???u...';
            result.fulfillmentMessages[0].text.text = [msg];
            return result;
        }

        // var result = respondResult;
        if (confident < acceptConfident) {
            return search(queryResult, res, next);
        }
        else {
            const msg = 'Xin l???i v?? s??? b???t ti???n n??y, xin vui l??ng nh???p l???i c??u h???i theo c??ch d??? hi???u h??n!';
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
            const msg = 'Xin c???m ??n b???n! M??nh r???t vui v?? ???? gi??p ??ch cho b???n.';
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
        msg = 'Xin l???i ch??ng t??i kh??ng c?? th??ng tin c???a ' + illName.toLowerCase();
        unknownController.save(queryText);
    }
    else {
        const infor = ill[attr];
        const suggest = getSuggest(ill, attr);
        if (infor.length == 0) {
            msg = 'Xin l???i ch??ng t??i kh??ng c?? th??ng tin ' + attrDescript[attr].toLowerCase() + ' c???a b???nh ' + illName.toLowerCase();
            if (suggest.length != 0)
                content = suggest;
            unknownController.save(queryText);
        }
        else {
            msg = attrDescript[attr] + ' c???a ' + illName.toLowerCase();
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
    const illInfo = await IllnessController.getIllByName('vi??m ?????i tr??ng');
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
            content: `Th??ng tin li??n quan ?????n ${illName}: `
        }
        return [suggestTitle].concat(result);
    }
    return [];
}


const attrDescript = {
    'tong_quan': 'T???ng quan',
    'trieu_chung': 'Tri???u ch???ng',
    'cach_dieu_tri': 'C??ch ??i???u tr???',
    'bien_chung': 'Bi???n ch???ng',
    'bien_phap_chuan_doan': 'Bi???n ph??p ch???n ??o??n',
    'cach_phong_ngua': 'C??ch ph??ng ng???a',
    'doi_tuong_mac_benh': '?????i t?????ng m???c b???nh',
    'duong_lay_truyen': '???????ng l??y truy???n',
    'nguyen_nhan': 'Nguy??n nh??n',
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