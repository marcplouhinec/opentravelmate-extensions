/**
 * Create MarkerIcon for waypoints.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/widget/map/Point',
    '../core/widget/map/Dimension',
    '../core/widget/map/VectorMarkerIcon'
], function(Point, Dimension, VectorMarkerIcon) {
    'use strict';

    var waypointMarkerIconBuilder = {

        /**
         * Build a MarkerIcon for the given waypoint.
         *
         * @param {Waypoint} waypoint
         * @param {WaypointDrawingInfo} drawingInfo
         */
        'buildIcon': function(waypoint, drawingInfo) {
            // First semi-circle
            var weight = drawingInfo.weight;
            var svgPath = 'M0,' + (-weight / 2) + ' A' + (weight / 2) + ',' + (weight / 2) + ' 0 0,0 0,' + (weight / 2);

            //Compute the distance between the 2 bounds
            var bounds = drawingInfo.bounds;
            var distBounds = 0;
            if (bounds.length > 1) {
                distBounds = Math.sqrt(Math.pow(bounds[1].x - bounds[0].x, 2) + Math.pow(bounds[1].y - bounds[0].y, 2));
                distBounds = Math.round(distBounds * 256);

                // Line between the 2 semi-circles
                svgPath += ' l' + distBounds + ',0';
            }

            //Second semi-circle
            svgPath += ' A' + (weight / 2) + ',' + (weight / 2) + ' 0 0,0 ' + distBounds + ',' + (-weight / 2);

            //Close the SVG path
            svgPath += ' z';

            // Compute the anchor
            var anchor = new Point(0, 0);
            if (bounds.length > 1) {
                anchor.x = Math.round(Math.cos(drawingInfo.angleWithAbscissaAxis) * (bounds[1].x - bounds[0].x) / 2 * 256);
                anchor.y = Math.round(Math.sin(drawingInfo.angleWithAbscissaAxis) * (bounds[1].y - bounds[0].y) / 2 * 256);
            }

            // Compute the size
            // TODO

            return new VectorMarkerIcon({
                fillColor: '#0070c0',
                fillOpacity: 1,
                path: svgPath,
                rotation: drawingInfo.angleWithAbscissaAxis * 360 / (2 * Math.PI),
                scale: 1,
                strokeColor: '#000000',
                strokeOpacity: 1,
                strokeWidth: 1,
                anchor: anchor,
                size: new Dimension(50, 50)
            });
        }

    };

    return waypointMarkerIconBuilder;
});
