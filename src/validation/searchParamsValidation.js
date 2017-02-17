'use strict'
const semver = require('semver')

module.exports = validateSearchParams

function validateSearchParams(search) {
    if (!search.name) {
        throw new Error('name is required')
    }

    if (typeof  search.name !== 'string') {
        throw new Error('name should be a string')
    }

    if (!search.versionRange) {
        throw new Error('version range is required')
    }

    if (!semver.validRange(search.versionRange)) {
        throw new Error(`invalid version range: ${search.versionRange}`)
    }
}