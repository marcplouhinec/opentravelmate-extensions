/**
 * Polygon that represents a waypoint on the map.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'underscore',
    '../core/widget/map/LatLng',
    '../core/widget/map/Polygon',
    '../core/widget/map/projectionUtils'
], function(_, LatLng, Polygon, projectionUtils) {
    'use strict';

    /**
     * @const
     * @type {number}
     */
    var WAYPOINT_RADIUS = 7 / 256;

    var waypointPolygonBuilder = {

        /**
         * Build a polygon.
         *
         * @param {WaypointDrawingInfo} drawingInfo
         * @param {Number} zoom
         * @param {Number=} scale
         * @param {Number=} fillColor
         * @param {Number=} strokeColor
         * @param {Number=} strokeWidth
         */
        'buildPolygon': function(drawingInfo, zoom, scale, fillColor, strokeColor, strokeWidth) {
            return new Polygon({
                path: _.map(_.range(0, 2 * Math.PI, Math.PI / 8), function(angle) {
                    var point = {
                        x: Math.cos(angle) * WAYPOINT_RADIUS + drawingInfo.centerPosition.x,
                        y: Math.sin(angle) * WAYPOINT_RADIUS + drawingInfo.centerPosition.y
                    };
                    return new LatLng(
                        projectionUtils.tileYToLat(zoom, point.y),
                        projectionUtils.tileXToLng(zoom, point.x)
                    );
                }),
                fillColor: _.isNumber(fillColor) ? fillColor : 0xFF0070C0,
                strokeColor: _.isNumber(strokeColor) ? strokeColor : 0xFF000000,
                strokeWidth: _.isNumber(strokeWidth) ? strokeWidth : 1
            });
        }
    };

    return waypointPolygonBuilder;
});
