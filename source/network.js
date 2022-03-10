export const curl = (url) => {
    return new Promise((resolve) =>
        fetch(url)
            .then((res) => res.text())
            .then((body) => resolve(body))
    )
}

export const getJson = (url) => {
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
}

export const postJson = async ({ data = null, to = null }) => {
    return (await fetch(to, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })).json()
}