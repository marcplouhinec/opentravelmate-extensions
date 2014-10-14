/**
 * Provide map tile information.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    'lodash',
    '../entity/Stop',
    '../entity/WSError'
], function($, _, Stop, WSError) {
    'use strict';

    /**
     * Cache stops.
     *
     * @type {Object.<string, Stop>}
     */
    var stopCache = {};

    /**
     * Add a stop to the cache.
     * Note: if the stop already exists in the cache, this function returns the existing one.
     *
     * @param {Stop} stop
     * @return {Stop} Stop from the cache
     */
    function addStopToCache(stop) {
        var stopFromCache = stopCache[stop.id];
        if (!stopFromCache) {
            stopFromCache = stop;
            stopCache[stop.id] = stopFromCache;
        }
        return stopFromCache;
    }

    /**
     * Provide map tile information.
     */
    var tileService = {

        /**
         * @public
         * @const
         * @type {string}
         */
        'TILE_MAP_OVERLAY_URL_PATTERN': 'http://www.opentravelmate.io/tile/${zoom}_${x}_${y}.png',

        /**
         * Find stops located in the given tiles.
         *
         * @param {Array.<string>} tileIds
         * @param {function(error: WSError|undefined, stops: Array.<Stop>)} callback
         */
        'findStopsByTileIds': function(tileIds, callback) {
            var url = 'http://www.opentravelmate.io/tiles/' + tileIds.join() + '/stops?callback=?';
            $.getJSON(url).done(function(result) {
                if (result.errorMessage) {
                    return callback(new WSError(result.httpStatus, result.errorMessage), []);
                }

                var stops = _.map(result, function(stopParams) {
                    return addStopToCache(new Stop({
                        id: stopParams.id,
                        latitude: stopParams.latitude,
                        longitude: stopParams.longitude,
                        name: stopParams.name
                    }));
                });

                callback(undefined, stops);
            });
        }

    };

    return tileService;
});
