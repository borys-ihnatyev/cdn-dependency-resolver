import {Search} from './Search'

export interface SearchResult extends Search {
    url?: string
}

export function fromSearch({name, versionRange}: Search, url?: string): SearchResult {
    return {name, versionRange, url}
}