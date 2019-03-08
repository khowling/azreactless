module.exports = async function (context, req) {
    context.log('ORDER - started');

    if (context.bindings.inputDocument) {

        if (req.method === "GET") {
            // "name": "$return" output binding expects you to supply the response when you call done()
            context.log (`getting ${JSON.stringify(context.bindings.inputDocument)}`)
            context.res = {
                body: JSON.stringify(context.bindings.inputDocument),
                headers: {'Content-Type': 'application/json'}
            }
        } else if (req.method === "DELETE") {
            context.bindings.outputDocument = JSON.stringify({id: req.params.id, type: "ORDER", active: false})
            context.log (`*****deleting ${context.bindings.outputDocument}`)
        }
    } else {
        context.res = {
            status: "400",
            body: `Document id "${req.params.id}" not found`,
        }
    }
    
    context.log('ORDER - done');
};