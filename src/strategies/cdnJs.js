'use strict'

const semver = require('semver')
const createResult = require('../dto/result')

module.exports = createCdnJsStrategy

const baseUrl = 'https://api.cdnjs.com/libraries'

function createCdnJsStrategy(search) {

    return {
        getUrl,
        getResult
    }

    function getUrl() {
        return `${baseUrl}?search=${search.name}&fields=version,assets`
    }

    function getResult({results}) {
        let url = null

        const result = results.find(isSearchNameEqual)

        if (result) {
            const asset = getMaxSatisfyingAsset(result.assets, search.versionRange)
            if (asset) {
                const latestVersion = result.version
                url = result.latest.replace(latestVersion, asset.version)
            }
        }

        return createResult(search, url)
    }

    function isSearchNameEqual(result) {
        return search.name === result.name
    }
}

function getMaxSatisfyingAsset(assets, versionRange) {
    const validAssetsVersions = assets.map((a) => a.version).filter(semver.valid)
    const maxSatisfyingVersion = semver.maxSatisfying(validAssetsVersions, versionRange)
    return assets.find((a) => a.version === maxSatisfyingVersion)
}
