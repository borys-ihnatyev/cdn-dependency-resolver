import {fetch} from '../http/fetch'
import {validateSearchParams} from '../validation/searchParamsValidation'
import createDefaultResolveStrategy from '../strategies/index'
import {SearchResult, fromSearch} from '../dto/SearchResult'
import {CdnDependencyResolver} from './CdnDependencyResolver'
import {ResolveStrategyFactory, ResolveStrategy} from '../strategies/ResolveStrategy'
import {Search} from '../dto/Search'

export function createResolver(): CdnDependencyResolver
export function createResolver(resolveStrategyFactories: ResolveStrategyFactory[]): CdnDependencyResolver
export function createResolver(...resolveStrategyFactories: ResolveStrategyFactory[]): CdnDependencyResolver
export function createResolver(...args): CdnDependencyResolver {

    const resolveStrategyFactories: ResolveStrategyFactory[] = resolveOverride()

    return {
        resolveDependencyUrl
    }

    function resolveOverride() {
        if (args.length === 0) {
            return [createDefaultResolveStrategy]
        }
        if (args[0] instanceof Array) {
            return args[0]
        }
        return args
    }

    function resolveDependencyUrl(search: Search): Promise<SearchResult> {
        validateSearchParams(search)

        const resolveStrategyIterator = getResolveStrategyIterator(search)
        return recursiveResolveDependencyUrl(resolveStrategyIterator)
    }

    function* getResolveStrategyIterator(search: Search): Iterator<ResolveStrategy> {
        for (let createStrategy of resolveStrategyFactories) {
            yield createStrategy(search)
        }
    }

    function recursiveResolveDependencyUrl(resolveStrategyIterator: Iterator<ResolveStrategy>,
                                           previousSearchResult?: SearchResult,
                                           previousError?: any): Promise<SearchResult> {
        const resolveStrategyIteratorResult = resolveStrategyIterator.next()

        if (resolveStrategyIteratorResult.done) {
            return onNoResult()
        }

        return resolveDependencyUrlWithStrategy(resolveStrategyIteratorResult.value)
            .then(onSuccess)
            .catch(onError)

        function onNoResult() {
            if (previousSearchResult) {
                return Promise.resolve(previousSearchResult)
            }
            return Promise.reject(previousError)
        }

        function onSuccess(result: SearchResult) {
            return result.url
                ? result
                : recursiveResolveDependencyUrl(resolveStrategyIterator, result)
        }

        function onError(error) {
            return recursiveResolveDependencyUrl(resolveStrategyIterator, null, error)
        }
    }

    function resolveDependencyUrlWithStrategy(resolveStrategy: ResolveStrategy): Promise<SearchResult> {
        return fetch(resolveStrategy.getUrl())
            .then(resolveStrategy.getResult)
    }
}
