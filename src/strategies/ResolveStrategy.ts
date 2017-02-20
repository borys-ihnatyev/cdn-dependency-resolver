import {SearchResult} from '../dto/SearchResult'
import {Search} from '../dto/Search'

export interface ResolveStrategy {
    getUrl(): string
    getResult(response: any): SearchResult
}

export type ResolveStrategyFactory = (search: Search) => ResolveStrategy