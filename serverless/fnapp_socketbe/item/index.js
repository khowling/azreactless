module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (context.bindings.inputDocument) {

        if (req.method === "GET") {
            // "name": "$return" output binding expects you to supply the response when you call done()
            context.log (`getting ${JSON.stringify(context.bindings.inputDocument)}`)
            context.res = {
                body: JSON.stringify(context.bindings.inputDocument),
                headers: {'Content-Type': 'application/json'}
            }
        } else if (req.method === "DELETE") {
            context.log (`deleting ${JSON.stringify(req.body)}`)
            context.bindings.outputDocument = {id: req.params.id, active: false}
            context.log (`deleting ${JSON.stringify(req.body)}`)
        }
    } else {
        context.res = {
            status: "400",
            body: `document id "${req.params.id}" not found`,
        }
    }
    
    context.done();
};