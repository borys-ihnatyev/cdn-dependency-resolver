'use strict'

import * as semver from 'semver'
import * as SearchResult from '../dto/SearchResult'
import {ResolveStrategy} from './ResolveStrategy'
import {Search} from '../dto/Search'

const baseUrl = 'https://api.cdnjs.com/libraries'

interface CDNJSResponse {
    results: CDNJSResponseResult[]
}

interface CDNJSResponseResult {
    name: string
    version: string
    latest: string
    assets: CDNJSResponseResultAsset[]
}

interface CDNJSResponseResultAsset {
    version: string
}

export function createCdnJsStrategy(search: Search): ResolveStrategy {

    return {
        getUrl,
        getResult
    }

    function getUrl(): string {
        return `${baseUrl}?search=${search.name}&fields=version,assets`
    }

    function getResult({results}: CDNJSResponse): SearchResult.SearchResult {
        let url

        const result = results.find(isSearchNameEqual)

        if (result) {
            const asset = getMaxSatisfyingAsset(result.assets, search.versionRange)
            if (asset) {
                const latestVersion = result.version
                url = result.latest.replace(latestVersion, asset.version)
            }
        }

        return SearchResult.fromSearch(search, url)
    }

    function isSearchNameEqual(result: CDNJSResponseResult) {
        return search.name === result.name
    }
}

function getMaxSatisfyingAsset(assets: CDNJSResponseResultAsset[], versionRange: string) {
    const validAssetsVersions = assets.map((a) => a.version).filter(semver.valid)
    const maxSatisfyingVersion = semver.maxSatisfying(validAssetsVersions, versionRange)
    return assets.find((a) => a.version === maxSatisfyingVersion)
}
