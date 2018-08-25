module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');


    if (req.method === "GET") {
        // "name": "$return" output binding expects you to supply the response when you call done()
        context.log (`listing inputDocuments ${JSON.stringify(context.bindings.inputDocument)}`)
        context.res = {
            body: context.bindings.inputDocument,
            headers: {'Content-Type': 'application/json'}
        }
    } else if (req.method === "POST") {
        context.log (`saving (upsert) ${JSON.stringify(req.body)}`)
        context.bindings.outputDocument = JSON.stringify(Object.assign({active: true}, req.body))

        context.res = {
            status: 201
        }
    }
    context.done();
};