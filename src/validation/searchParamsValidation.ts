'use strict'

import * as semver from 'semver'
import {Search} from '../dto/Search'

export function validateSearchParams(search: Search): void {
    if (!search.name) {
        throw new Error('name is required')
    }

    if (typeof search.name !== 'string') {
        throw new Error('name should be a string')
    }

    if (!search.versionRange) {
        throw new Error('version range is required')
    }

    if (!semver.validRange(search.versionRange)) {
        throw new Error(`invalid version range: ${search.versionRange}`)
    }
}