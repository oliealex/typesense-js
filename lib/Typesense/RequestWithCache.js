"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestWithCache {
    constructor() {
        this.responseCache = {};
    }
    // Todo: should probably be passed a callback instead, or an apiCall instance. Types are messy this way
    async perform(requestContext, requestFunction, requestFunctionArguments, { cacheResponseForSeconds = 2 * 60 }) {
        // Don't store any responses if cache is disabled
        if (cacheResponseForSeconds <= 0) {
            return requestFunction.call(requestContext, ...requestFunctionArguments);
        }
        const requestFunctionArgumentsJSON = JSON.stringify(requestFunctionArguments);
        const cacheEntry = this.responseCache[requestFunctionArgumentsJSON];
        if (cacheEntry) {
            if (Date.now() - cacheEntry.requestTimestamp < cacheResponseForSeconds * 1000) {
                // Cache entry is still valid, return it
                return Promise.resolve(cacheEntry.response);
            }
            else {
                // Cache entry has expired, so delete it explicitly
                delete this.responseCache[requestFunctionArgumentsJSON];
            }
        }
        const response = await requestFunction.call(requestContext, ...requestFunctionArguments);
        this.responseCache[requestFunctionArgumentsJSON] = {
            requestTimestamp: Date.now(),
            response
        };
        return response;
    }
}
exports.default = RequestWithCache;
//# sourceMappingURL=RequestWithCache.js.map