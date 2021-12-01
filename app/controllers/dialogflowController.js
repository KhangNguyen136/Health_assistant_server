exports.getMsg = (req, res) => {
    console.log(req.body);
    const queryResult = req.body.queryResult
    const intent = queryResult.intent.displayName;
    const result = respondResult;
    var msg
    switch (intent) {
        case 'tra_cuu':
            msg = '(From back-end)\n Tra cứu thông tin khác: ' + queryResult.queryText;
            result.fulfillmentMessages[0].text.text = [msg];
            res.send(JSON.stringify(result));
            break;
        default:
            illness_info(queryResult, res);
            break;
    }
}

function illness_info(queryResult, res) {
    const intent = queryResult.intent.displayName;
    const illName = queryResult.parameters.benh;
    const result = respondResult;
    var msg = '(From back-end)\n Tra cứu ' + intent + ' của bệnh ' + illName;
    result.fulfillmentMessages[0].text.text = [msg];
    res.send(JSON.stringify(result));
}


const respondResult = {
    fulfillmentMessages: [
        {
            text: {
                text: []
            }
        }
    ]
}