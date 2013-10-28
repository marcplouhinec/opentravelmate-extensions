/**
 * Polygon that represents a waypoint on the map.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/widget/map/LatLng',
    '../core/widget/map/Polygon',
    '../core/widget/map/projectionUtils'
], function(LatLng, Polygon, projectionUtils) {
    'use strict';

    /**
     * Create a new WaypointPolygon.
     *
     * @constructor
     * @param {Waypoint} waypoint
     * @param {WaypointDrawingInfo} drawingInfo
     */
    function WaypointPolygon(waypoint, drawingInfo) {
        this._waypoint = waypoint;
        this._drawingInfo = drawingInfo;
    }

    /**
     * Build a Polygon to be displayed on the map.
     *
     * @param {Number} zoomLevel Map zoom
     * @return {Polygon}
     */
    WaypointPolygon.prototype.buildPolygon = function(zoomLevel) {
        var boundLeft = this._drawingInfo.bounds[0];
        var boundRight = this._drawingInfo.bounds[this._drawingInfo.bounds.length > 1 ? 1 : 0];
        var weight = this._drawingInfo.weight;

        var path = [
            new LatLng(
                projectionUtils.tileYToLat(zoomLevel, boundLeft.y - weight / 512),
                projectionUtils.tileXToLng(zoomLevel, boundLeft.x - weight / 512)
            ),
            new LatLng(
                projectionUtils.tileYToLat(zoomLevel, boundLeft.y - weight / 512),
                projectionUtils.tileXToLng(zoomLevel, boundRight.x + weight / 512)
            ),
            new LatLng(
                projectionUtils.tileYToLat(zoomLevel, boundRight.y + weight / 512),
                projectionUtils.tileXToLng(zoomLevel, boundRight.x + weight / 512)
            ),
            new LatLng(
                projectionUtils.tileYToLat(zoomLevel, boundRight.y + weight / 512),
                projectionUtils.tileXToLng(zoomLevel, boundLeft.x - weight / 512)
            )
        ];

        return new Polygon({
            path: path,
            fillColor: 0xFF0070C0,
            strokeColor: 0xFF000000,
            strokeWidth: 1
        });
    };

    return WaypointPolygon;
});
