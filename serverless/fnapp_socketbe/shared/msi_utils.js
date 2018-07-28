
const 
    http = require('http'),
    https = require('https'),
    url = require('url')

function get_access_token(resource) {
    return new Promise((accept, reject) => {
        if (!(process.env.MSI_ENDPOINT && process.env.MSI_SECRET)) {
            reject({code: "NO MSI", message: "MSI environment not avaiable"})
        } else {
            let msi_request = Object.assign(url.parse(`${process.env.MSI_ENDPOINT}?resource=${encodeURIComponent(resource)}&api-version=2017-09-01`), {headers: {"secret": process.env.MSI_SECRET }})
            http.get(msi_request, (res) => {
                let raw = '';
                res.on('data', (d) => {
                    raw+= d
                });

                res.on('end', () => {
                    if(!(res.statusCode === 200 || res.statusCode === 201)) {
                        reject({code: res.statusCode, message: raw})
                    } else {
                        accept(JSON.parse(raw))
                    }
                })
            })
        }
    })
}


    
module.exports = {
    get_access_token
}