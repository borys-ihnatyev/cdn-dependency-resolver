'use strict'

const {createResolver} = require('../lib')
const {dependencies} = require('./test-package.json')

const resolver = createResolver()

const searchList = Object.keys(dependencies)
    .map(convertDependencyToSearch)

Promise.all(
    searchList.map(resolver.resolveDependencyUrl)
).then((cdnResults) => {
    console.log(JSON.stringify(cdnResults, null, 4))
})

function convertDependencyToSearch(name) {
    return {name, versionRange: dependencies[name]}
}
