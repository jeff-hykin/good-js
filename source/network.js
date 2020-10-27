// use libs since node doesn't have fetch or XMLHttpRequest
if (typeof document == 'undefined') {
    var fetch = require("node-fetch")
    var XMLHttpRequest = require("xmlhttprequest")
}

module.exports = {
    curl(url) {
        return new Promise((resolve) =>
            fetch(url)
                .then((res) => res.text())
                .then((body) => resolve(body))
        )
    },
    getJson(url) {
        return new Promise((resolve, reject) =>
            fetch(url)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    resolve(data)
                })
                .catch(function (err) {
                    reject(err)
                })
        )
    },
    async postJson({ data = null, to = null }) {
        return (await fetch(to, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })).json()
    },
}
