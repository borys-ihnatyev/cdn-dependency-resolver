'use strict'

const fetch = require('node-fetch')
const validateSearchParams = require('./validation/searchParamsValidation')
const createDefaultResolveStrategy = require('./strategies/default')

module.exports = createResolver

function createResolver(createResolveStrategy = createDefaultResolveStrategy) {
    return {
        resolveDependencyUrl
    }

    function resolveDependencyUrl(search) {
        validateSearchParams(search)
        const strategy = createResolveStrategy(search)

        return fetch(strategy.getUrl())
            .then((res) => res.json())
            .then((res) => strategy.getResult(res))
    }
}
