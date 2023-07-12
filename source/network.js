export const curl = (url) => fetch(url).then(res=>res.text())

export const getJson = (url) => fetch(url).then(res=>res.json())

export const postJson = ({ data = null, to = null }) =>
    fetch(to, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res=>res.json())