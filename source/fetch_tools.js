export const getRedirectedUrl = async (url, options)=>{
    const {resolve, reject, promise} = Promise.withResolvers()
    if (options?.timeout) {
        setTimeout(()=>reject(Error("timeout")), options.timeout)
        delete options.timeout
    }
    const output = fetch(url, options).then(response => response.redirected ? response.url : null)
    output.then(resolve).catch(reject)
    return promise
}

export const jsonFetch = async (url, options)=>{
    const response = await fetch(url, options)
    if (response.ok) {
        const text = await response.text()
        try {
            return JSON.parse(text)
        } catch (error) {
            throw Error(`when fetching ${url} the response was not json, it was:\n${JSON.stringify(text)}`, response)
        }
    } else {
        throw Error(`when fetching ${url} I got an error response: ${response.statusText}`, response)
    }
}

/**
 * @example
 * ```js
 * let controlledFetcher = createControlledFetcher({
 *     cache: {}, // you can provide values from localStorage or disk storage here
 *     rateLimitMilliseconds: 5000, // google is picky and defensive
 *     onUpdateCache(url, cache) {
 *        // you can push updates to disk/localStorage here
 *     },
 *     urlNormalizer(url) {
 *         return new URL(url)
 *     }
 * })
 * controlledFetcher.cache // Object
 * controlledFetcher.lastFetchTime // number, unix epoch
 * controlledFetcher.rateLimitMilliseconds // number, milliseconds (it can be dynamically changed)
 * ```
 */
export function createControlledFetcher({ cache={}, rateLimitMilliseconds=null, onUpdateCache=_=>0, urlNormalizer=_=>_, lastFetchTime=null, outputModifyer=result=>result.bytes() }={}) {
    async function controlledFetcher(url, options, {onUpdateCache=_=>0,}={}) {
        const cache = controlledFetcher.cache
        url = urlNormalizer(url)
        if (!cache[url]) {
            let needToWait
            if (controlledFetcher.rateLimitMilliseconds!=null) {
                if (lastFetchTime == null) {
                    lastFetchTime = new Date()
                }
                controlledFetcher.lastFetchTime = controlledFetcher.lastFetchTime || new Date() 
                do {
                    // avoid hitting rate limit
                    const thresholdTime = controlledFetcher.lastFetchTime.getTime() + controlledFetcher.rateLimitMilliseconds
                    const now = new Date().getTime()
                    needToWait = thresholdTime - now
                    if (needToWait > 0) {
                        await new Promise(r=>setTimeout(r, needToWait))
                    }
                } while (needToWait > 0)
            }
            controlledFetcher.lastFetchTime = new Date()
            const result = await fetch(url, options)
            if (result.ok) {
                let output = await outputModifyer(result)
                if (output) {
                    cache[url] = output
                    await onUpdateCache(url, controlledFetcher.cache)
                }
            } else {
                throw Error(`when fetching ${url} I got an error response ${result.statusText}`, result)
            }
        }
        return cache[url]
    }
    Object.assign(controlledFetcher,{
        cache,
        lastFetchTime,
        rateLimitMilliseconds,
    })
    return controlledFetcher
}

export function createControlledJsonFetcher({ cache={}, rateLimitMilliseconds=null, onUpdateCache=_=>0, urlNormalizer=_=>_, lastFetchTime=new Date(), ...args }={}) {
    return createControlledFetcher({
        cache,
        rateLimitMilliseconds,
        onUpdateCache,
        urlNormalizer,
        lastFetchTime,
        outputModifyer: result=>result.json(),
        ...args
    })
}

export function createControlledTextFetcher({ cache={}, rateLimitMilliseconds=null, onUpdateCache=_=>0, urlNormalizer=_=>_, lastFetchTime=new Date(), ...args }={}) {
    return createControlledFetcher({
        cache,
        rateLimitMilliseconds,
        onUpdateCache,
        urlNormalizer,
        lastFetchTime,
        outputModifyer: result=>result.text(),
        ...args
    })
}