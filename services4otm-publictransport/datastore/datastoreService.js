/**
 * Define the datastore service that load data from the services4otm.com datastore.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'underscore',
    './Waypoint',
    './WaypointDrawingInfo',
    './Line',
    './Route',
    './Timetable',
    './WSError'
], function($, _, Waypoint, WaypointDrawingInfo, Line, Route, Timetable, WSError) {
    'use strict';

    /**
     * Cache waypoints.
     *
     * @type {Object.<String, Waypoint>}
     */
    var waypointCache = {};

    /**
     * Add a waypoint to the cache.
     * Note: if the waypoint already exists in the cache, this function returns the existing one.
     *
     * @param {Waypoint} waypoint
     * @return {Waypoint} Waypoint from the cache
     */
    function addWaypointToCache(waypoint) {
        var waypointFromCache = waypointCache[waypoint.id];
        if (!waypointFromCache) {
            waypointFromCache = waypoint;
            waypointCache[waypoint.id] = waypointFromCache;
        }
        return waypointFromCache;
    }

    /**
     * Provide access to the datastore web services.
     */
    var datastoreService = {

        /**
         * Find stop waypoints located in the given tiles.
         *
         * @param {Array.<String>} tileIds
         * @param {function(error: WSError|undefined, stops: Array.<Waypoint>)} callback
         */
        'findStopsByTileIds': function(tileIds, callback) {
            var url = 'http://ns55.evxonline.net/tiles/' + tileIds.join() + '/stops?callback=?';
            $.getJSON(url).done(function(result) {
                if (result.errorMessage) {
                    return callback(new WSError(result.httpStatus, result.errorMessage), []);
                }

                var stops = _.map(result, function(stop) {
                    return addWaypointToCache(new Waypoint({
                        id: stop.id,
                        type: 'stop',
                        latitude: stop.latitude,
                        longitude: stop.longitude,
                        stopName: stop.name
                    }));
                });

                callback(undefined, stops);
            });
        },

        /**
         * Find the routes that go through the given stop.
         *
         * @param {String} stopId
         * @param {function(error: WSError|undefined, routes: Array.<Route>)} callback
         */
        'findRoutesByStopId': function(stopId, callback) {
            var url = 'http://ns55.evxonline.net/stop/' + this._encodeId(stopId) + '/routes?callback=?';
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
         * Find the timetables for the given route.
         *
         * @param {String} routeId
         * @param {function(error: WSError|undefined, timetables: Array.<Timetable>)} callback
         */
        'findTimetablesByRouteId' : function(routeId, callback) {
            var url = 'http://ns55.evxonline.net/route/' + this._encodeId(routeId) + '/timetables?callback=?';
            $.getJSON(url).done(function(result) {
                if (result.errorMessage) {
                    return callback(new WSError(result.httpStatus, result.errorMessage), []);
                }

                var timetables = _.map(result, function(timetable) {
                    return new Timetable(timetable);
                });

                callback(undefined, timetables);
            });
        },

        /**
         * Encode an ID in order to make it URI-compatible.
         *
         * @private
         * @param {String} id
         * @return {String} encoded ID
         */
        '_encodeId': function(id) {
            var encodedId = encodeURIComponent(String(id));
            if (encodedId.indexOf('%2F')) {
                encodedId = encodedId.replace('%2F', '%252F');
            }
            return encodedId;
        }
    };

    return datastoreService;
});