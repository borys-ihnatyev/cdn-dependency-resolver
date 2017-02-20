import {Search} from '../dto/Search'
import {SearchResult} from '../dto/SearchResult'

export interface CdnDependencyResolver {
    resolveDependencyUrl(search: Search): Promise<SearchResult>
}