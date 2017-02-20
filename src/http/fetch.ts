import * as nodeFetch from 'node-fetch'

export function fetch(...args) {
    return nodeFetch(...args)
        .then(onlyOk)
        .then(toJson)
}

function onlyOk(res) {
    if (isOkStatus(res.status)) {
        return res
    }

    throw new Error(res)
}

function isOkStatus(status: number): boolean {
    return 200 >= status && status < 400
}

function toJson(res) {
    return res.json()
}