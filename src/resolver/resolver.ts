import {fetch} from '../http/fetch'
import {validateSearchParams} from '../validation/searchParamsValidation'
import createDefaultResolveStrategy from '../strategies/index'
import {SearchResult} from '../dto/SearchResult'
import {CdnDependencyResolver} from './CdnDependencyResolver'
import {ResolveStrategyFactory} from '../strategies/ResolveStrategy'
import {Search} from '../dto/Search'

export function createResolver(createResolveStrategy: ResolveStrategyFactory = createDefaultResolveStrategy): CdnDependencyResolver {

    return {
        resolveDependencyUrl
    }

    function resolveDependencyUrl(search: Search): Promise<SearchResult> {
        validateSearchParams(search)
        const strategy = createResolveStrategy(search)

        return fetch(strategy.getUrl())
            .then(strategy.getResult)
    }
}
