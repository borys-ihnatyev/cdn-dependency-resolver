# CDN dependency resolver

[![npm version](https://badge.fury.io/js/cdn-dependency-resolver.svg)](https://badge.fury.io/js/cdn-dependency-resolver)

## Description

This package created to solve resolving dependency from cdn

## Supported CDNs

Currently there is only supported resolving from [CDNJS](https://cdnjs.com/)

You can simply implement your own strategy and pass to `createResolver` function:

```js

const {fromSearch, createResolver} = require('cdn-dpepndency-resolver')

function myCdnStrategy(search) {
    return {
        getUrl() {
            return `https://mycdn.com?search=${search.name}&versionRange=${search.versionRange}`
        },
        
        getResult(response) {
            const url = response.url || null
            /* here might be more complicated logic :) */
            return fromSearch(search, url)
        }
    }
}

const resolver = createResolver(myCdnStrategy)

const search = {
    name: 'react', // dependency name
    versionRange: '^15.x.x' // semver range
}

resolver
    .resolveDependencyUrl(search)
    .then(({name, versionRange, url}) => {
        /* url is null when not resolved */
        if(url) {
            console.log(`${name}@${versionRange} url on mycdn is: ${url}`)
        } else {
            console.log(`${name}@${versionRange} is not stored on mycdn :(`)
        }
    })

```

See more in [examples](https://github.com/borys-ihnatyev/cdn-dependency-resolver/tree/master/examples) folder
