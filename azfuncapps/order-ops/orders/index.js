module.exports = async function (context, req) {
    context.log('ORDERS - started');

    
    if (req.method === "GET") {
        // "name": "$return" output binding expects you to supply the response when you call done()
        context.log (`ORDERS - GET inputDocuments: ${JSON.stringify(context.bindings.inputDocument)}`)
        context.res = {
            body: JSON.stringify(context.bindings.inputDocument),
            headers: {'Content-Type': 'application/json'}
        }
    } else if (req.method === "POST") {
        context.log (`ORDERS - POST saving body to outputDocument (upsert) ${JSON.stringify(req.body)}`)
        context.bindings.outputDocument = JSON.stringify(Object.assign({active: true, type: "ORDER"}, req.body))

        context.res = {
            status: 201
        }
    }
    context.log ('ORDERS - done')
};