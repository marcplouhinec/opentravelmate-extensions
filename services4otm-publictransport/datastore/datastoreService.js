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
    './WSError'
], function($, _, Waypoint, WaypointDrawingInfo, Line, WSError) {
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
         * Find stop waypoints with drawing information located in the given tiles.
         *
         * @param {Array.<String>} tileIds
         * @param {function(error: WSError|undefined, stopsWithDrawingData: Array.<{waypoint: Waypoint, drawingInfo: WaypointDrawingInfo}>)} callback
         */
        'findStopsWithDrawingDataByTileIds': function(tileIds, callback) {
            var url = 'http://www.services4otm.com/datastore/publictransport/tile/stopsWithDrawingData?tileIds=' + JSON.stringify(tileIds) + '&callback=?';
            $.getJSON(url).done(function(result) {
                if (!result.success) {
                    return callback(new WSError(result.errorcode, result.errormessage), []);
                }

                var stopsWithDrawingData = _.map(result.stopsWithDrawingData, function(stopWithDrawingData) {
                    return {
                        waypoint: addWaypointToCache(new Waypoint(stopWithDrawingData.waypoint)),
                        drawingInfo: new WaypointDrawingInfo(stopWithDrawingData.drawingInfo)
                    };
                });

                callback(undefined, stopsWithDrawingData);
            });
        },

        /**
         * Find the lines and their directions (waypoints) that go through the given waypoint.
         *
         * @param {String} waypointId
         * @param {function(error: WSError|undefined, lines: Array.<Line>, directions: Array.<Waypoint>)} callback
         */
        'findLinesAndDirectionsByWaypoint': function(waypointId, callback) {
            var url = 'http://www.services4otm.com/datastore/publictransport/line/findLinesAndDirectionsByWaypoint/' + waypointId + '?callback=?';
            $.getJSON(url).done(function(result) {
                if (!result.success) {
                    return callback(new WSError(result.errorcode, result.errormessage), [], []);
                }

                var lines = _.map(result.lines, function(line) {
                    return new Line(line);
                });
                var directions = _.map(result.directions, function(direction) {
                    return addWaypointToCache(new Waypoint(direction));
                });

                callback(undefined, lines, directions);
            });
        }
    };

    return datastoreService;
});