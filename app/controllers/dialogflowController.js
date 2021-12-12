// import { getIllByName } from './illnessController';
const IllnessController = require('./illnessController');

exports.getMsg = (req, res) => {
    const queryResult = req.body.queryResult
    const intent = queryResult.intent.displayName;
    const result = respondResult;
    // console.log(queryResult);

    var msg
    switch (intent) {
        case 'tra_cuu':
            msg = '(From back-end)\n Tra cứu thông tin khác: ' + queryResult.queryText;
            result.fulfillmentMessages[1].payload.content = [{
                type: 's',
                content: 'Tra cứu thông tin khác: ' + queryResult.queryText
            }]
            result.fulfillmentMessages[0].text.text = [msg];
            res.send(JSON.stringify(result));
            break;
        case 'doi_thuoc_tinh':
            change_attr_route(queryResult, res);
            break;
        default:
            illness_info_route(queryResult, res);
            // console.log('Illness infor with ' + queryResult.toString());
            break;
    }
}

async function illness_info_route(queryResult, res) {
    const intent = queryResult.intent.displayName;
    const illName = queryResult.parameters.benh;
    const result = await get_illness_infor(intent, illName);
    res.send(JSON.stringify(result));
}

async function change_attr_route(queryResult, res) {
    const intent = queryResult.parameters.thuoc_tinh
    const illName = queryResult.outputContexts[0].parameters.benh
    const result = await get_illness_infor(intent, illName);
    res.send(JSON.stringify(result));
}

async function get_illness_infor(intent, illName) {
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
        const infor = ill[intent];
        if (infor.length == 0) {
            msg = 'Xin lỗi chúng tôi không có thông tin ' + intentDescript[intent].toLowerCase() + ' của bệnh ' + illName
            // content.push({
            //     type: 's',
            //     content: msg
            // })
        }
        else {
            msg = intentDescript[intent] + ' bệnh ' + illName
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

const intentDescript = {
    'tong_quan': 'Tổng quan',
}

const respondResult = {
    // fulfillmentText: '',
    fulfillmentMessages: [
        {
            // this item is optional
            text: {
                text: [

                ]
            }
        },
        {
            payload: {
                content: [],
                // Your custom fields payload
            }
        }
    ]
    // responeContent: []
}

