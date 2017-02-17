'use strict'

module.exports = createResultDto

function createResultDto({name, versionRange}, url) {
    return {name, versionRange, url}
}