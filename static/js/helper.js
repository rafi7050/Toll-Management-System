function saTojoArray(sa, rename = false) {
    var returnArray = {};
    var returnObject = []
    let formArray = sa
    for (var i = 0; i < formArray.length; i++) {
        let name = formArray[i]['name'].split("-")[2]
        if (returnArray[name]) {
            returnObject.push(returnArray);
            returnArray = {}
            returnArray[name] = formArray[i]['value'];
        } else {
            returnArray[name] = formArray[i]['value'];
        }
    }
    returnObject.push(returnArray);
    return returnObject
}

function orderFormSerialize() {
    var form_data = objectifyForm($('.order_form').find('input,select,textarea').serializeArray())
    var order_details = $('.form_set_container').find('input,select').not('input[type="hidden"]').serializeArray()
    form_data['order_details'] = saTojoArray(order_details)
    return form_data
}
