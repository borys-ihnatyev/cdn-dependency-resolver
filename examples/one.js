'use strict'

const {createResolver} = require('../lib')

const resolver = createResolver()

resolver.resolveDependencyUrl({name: 'react', versionRange: '15.1.x'})
    .then((res) => console.log(JSON.stringify(res, null, 2)))