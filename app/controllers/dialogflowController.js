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
    var content = [];

    // console.log(ill);
    if (ill == null) {
        msg = 'Xin lỗi chúng tôi không có thông tin của bệnh này'
        content.push({
            type: 's',
            content: 'Xin lỗi chúng tôi không có thông tin của bệnh này'
        })
    }
    else {
        switch (intent) {
            case 'tong_quan_benh':
                if (ill.tong_quan.length == 0) {
                    msg = 'Xin lỗi chúng tôi không có thông tin tổng quan của bệnh ' + illName
                    content.push({
                        type: 's',
                        content: 'Xin lỗi chúng tôi không có thông tin tổng quan của bệnh ' + illName
                    })
                }
                else {
                    msg = 'Tổng quan bệnh ' + illName
                    content = ill.tong_quan[0].noi_dung;
                }
                break;
            case 'trieu_chung_benh':
                if (ill.trieu_chung.length == 0) {
                    msg = 'Xin lỗi chúng tôi không có thông tin về triệu chứng của bệnh ' + illName
                    content.push({
                        type: 's',
                        content: 'Xin lỗi chúng tôi không có thông tin về triệu chứng của bệnh ' + illName
                    })
                }
                else {
                    msg = 'Triệu chứng bệnh ' + illName
                    content = ill.trieu_chung[0].noi_dung
                }
                break;
            case 'nguyen_nhan_benh':
                if (ill.nguyen_nhan.length == 0) {
                    msg = 'Xin lỗi chúng tôi không có thông tin về nguyên nhân của bệnh ' + illName
                    content.push({
                        type: 's',
                        content: 'Xin lỗi chúng tôi không có thông tin về nguyên nhân của bệnh ' + illName
                    })
                }
                else {
                    msg = 'Nguyên nhân bệnh ' + illName
                    content = ill.nguyen_nhan[0].noi_dung
                }
                break;
            case 'cach_phong_ngua':
                if (ill.cach_phong_ngua.length == 0) {
                    msg = 'Xin lỗi chúng tôi không có thông tin về cách phòng ngừa của bệnh ' + illName
                    content.push({
                        type: 's',
                        content: 'Xin lỗi chúng tôi không có thông tin về cách phòng ngừa của bệnh ' + illName
                    })
                }
                else {
                    msg = 'Cách phòng ngừa bệnh ' + illName
                    content = ill.cach_phong_ngua[0].noi_dung
                }
                break;

            case 'cach_dieu_tri':
                if (ill.cach_dieu_tri.length == 0) {
                    msg = 'Xin lỗi chúng tôi không có thông tin về cách điều trị của bệnh ' + illName
                    content.push({
                        type: 's',
                        content: 'Xin lỗi chúng tôi không có thông tin về cách điều trị của bệnh ' + illName
                    })
                }
                else {
                    msg = 'Cách điều trị bệnh ' + illName
                    content = ill.cach_dieu_tri[0].noi_dung
                }
                break;
            default:
                msg = 'Thông tin khác của bệnh ' + illName
                content.push({
                    type: 's',
                    content: 'Thông tin khác của bệnh ' + illName
                })
                break;
        }
    }

    result.fulfillmentMessages[0].text.text = [msg];
    result.fulfillmentMessages[1].payload.content = content;
    console.log(result.fulfillmentMessages);
    return result;
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

