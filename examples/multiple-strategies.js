'use strict'

const {createResolver, createCdnJsStrategy, fromSearch} = require('../lib')

const resolver = createResolver([
    createNoopCdnStrategy,
    createCdnJsStrategy
])

resolver.resolveDependencyUrl({name: 'react', versionRange: '15.1.x'})
    .then((res) => console.log(JSON.stringify(res, null, 2)))

function createNoopCdnStrategy(search) {
    return {
        getUrl
    }

    function getUrl() {
        console.log('calling first cdn ... (expecting error)')
        return 'http://noopcdn.com/'
    }

    function getResult() {
        return fromSearch(search)
    }
}