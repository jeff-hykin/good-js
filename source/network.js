module.exports = {
    curl(url) {
        return new Promise((resolve) =>
            fetch(url)
                .then((res) => res.text())
                .then((body) => resolve(body))
        )
    },
    get(url) {
        return new Promise((resolve, reject) =>
            fetch(url)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    resolve(data)
                })
                .catch(function () {
                    reject()
                })
        )
    },
    post({ data = null, to = null }) {
        return new Promise((resolve, reject) => {
            let theRequest = new XMLHttpRequest()
            theRequest.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    try {
                        var output = JSON.parse(theRequest.responseText)
                    } catch (error) {
                        var output = theRequest.responseText
                    }
                    resolve(output)
                } else {
                    reject({
                        status: this.status,
                        statusText: theRequest.statusText,
                    })
                }
            }
            theRequest.onerror = function () {
                reject({
                    status: this.status,
                    statusText: theRequest.statusText,
                })
            }
            theRequest.open("POST", to, true)
            theRequest.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
            theRequest.send(JSON.stringify(data))
        })
    },
}
