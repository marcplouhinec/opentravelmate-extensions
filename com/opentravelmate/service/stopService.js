/**
 * Provide transport stop information.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    'lodash',
    '../entity/Stop',
    '../entity/Route',
    '../entity/WSError'
], function($, _, Stop, Route, WSError) {
    'use strict';

    /**
     * Provide transport stop information.
     */
    var stopService = {

        /**
         * Find the routes that go through the given stop.
         *
         * @param {string} stopId
         * @param {function(error: WSError|undefined, routes: Array.<Route>)} callback
         */
        'findRoutesByStopId': function(stopId, callback) {
            var url = 'http://www.opentravelmate.io/stop/' + this._encodeId(stopId) + '/routes?callback=?';
            $.getJSON(url).done(function(result) {
                if (result.errorMessage) {
                    return callback(new WSError(result.httpStatus, result.errorMessage), []);
                }

                var routes = _.map(result, function(route) {
                    return new Route(route);
                });

                callback(undefined, routes);
            });
        },

        /**
         * Encode an ID in order to make it URI-compatible.
         *
         * @private
         * @param {string} id
         * @return {string} encoded ID
         */
        '_encodeId': function(id) {
            var encodedId = encodeURIComponent(String(id));
            if (encodedId.indexOf('%2F')) {
                encodedId = encodedId.replace('%2F', '%252F');
            }
            return encodedId;
        }

    };

    return stopService;
});
