
const 
http = require('http'),
https = require('https'),
url = require('url'),
msi_utils = require ('../shared/msi_utils.js')


function createACI (access_token, sid, rg, aci_group) {

return new Promise((accept, reject) => {

    const aci_req_body = JSON.stringify({
        "id": `/subscriptions/${sid}/resourceGroups/${rg}/providers/Microsoft.ContainerInstance/containerGroups/${aci_group}`,
        "location": "westeurope",
        "name": aci_group,
        "properties": {
        "containers": [
            {
            "name": aci_group,
            "properties": {
                "command": [],
                "environmentVariables": [],
                "image": "nginx",
                "ports": [
                {
                    "port": 80
                }
                ],
                "resources": {
                "requests": {
                    "cpu": 1,
                    "memoryInGB": 1.5
                }
                },
            }
            }
        ],
        "imageRegistryCredentials": [],
        "ipAddress": {
            "ports": [
            {
                "protocol": "TCP",
                "port": 80
            }
            ],
            "type": "Public",
            "dnsNameLabel": aci_group
        },
        "osType": "Linux",
        },
        "type": "Microsoft.ContainerInstance/containerGroups"
    })

    let	aci_req = https.request({
        hostname: 'management.azure.com',
        path: `/subscriptions/${sid}/resourceGroups/${rg}/providers/Microsoft.ContainerInstance/containerGroups/${aci_group}?api-version=2018-06-01`,
        method: 'PUT',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'Content-Length': Buffer.byteLength(aci_req_body),
            'Authorization': `Bearer ${access_token}`
        }
    }, (res) => {
        let raw = '';
        res.on('data', (chunk) => {
            raw += chunk
        })

        res.on('end', () => {
            if(!(res.statusCode === 200 || res.statusCode === 201)) {
                reject({code: res.statusCode, message: raw})
            } else {
                accept(JSON.parse(raw))
            }
        })
    })

    aci_req.write(aci_req_body)
    aci_req.end()

})
}

module.exports = async function (context, req) {

    context.log('JavaScript HTTP trigger function processed a request.');
    let sid ="95efa97a-9b5d-4f74-9f75-a3396e23344d",
        rg = "kh-int-demo-nodeless",
        aci_group = "backend_app"

    context.log ( JSON.stringify(req))


    msi_utils.get_access_token("https://management.azure.com").then(access_token => {
        context.log ("calling createACI")
        createACI(access_token, sid, rg, aci_group).then (succ => {
            context.res = { body: {created: aci_group} };
        }, err => {
            // this will return a 500
            context.res = { status: 500, body: JSON.stringify(err)};
        })
    }, err => {
        // this will return a 500
        context.res = { status: 500, body: JSON.stringify(err)};
    })
};