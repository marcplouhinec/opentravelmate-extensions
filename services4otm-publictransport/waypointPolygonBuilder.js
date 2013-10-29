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

    var waypointPolygonBuilder = {

        /**
         * Build a polygon.
         *
         * @param {WaypointDrawingInfo} drawingInfo
         * @param {Number} zoom
         */
        'buildPolygon': function(drawingInfo, zoom) {
            var self = this;
            var boundLeft = drawingInfo.bounds[0];
            var boundRight = drawingInfo.bounds[drawingInfo.bounds.length > 1 ? 1 : 0];
            var weight = drawingInfo.weight;
            var boundsDistance = 0;
            if (drawingInfo.bounds.length > 1) {
                boundsDistance = Math.sqrt(Math.pow(boundRight.x - boundLeft.x, 2) + Math.pow(boundRight.y - boundLeft.y, 2));
            }

            // Create a rectangle
            var pathVectors = [
                [
                    [boundLeft.x - weight / 512],
                    [boundLeft.y + weight / 512],
                    [1]
                ], [
                    [boundLeft.x - weight / 512],
                    [boundLeft.y - weight / 512],
                    [1]
                ], [
                    [boundLeft.x + weight / 512 + boundsDistance],
                    [boundLeft.y - weight / 512],
                    [1]
                ], [
                    [boundLeft.x + weight / 512 + boundsDistance],
                    [boundLeft.y + weight / 512],
                    [1]
                ]
            ];

            // Apply a translation to have the boundLeft as origin, then a rotation and finally translate back to the first origin
            // see http://www.useragentman.com/blog/2011/01/07/css3-matrix-transform-for-the-mathematically-challenged/
            var angle = drawingInfo.angleWithAbscissaAxis;
            var translation1Matrix = [
                [1, 0, -boundLeft.x],
                [0, 1, -boundLeft.y],
                [0, 0, 1           ]
            ];
            var rotationMatrix = [
                [Math.cos(angle), -Math.sin(angle), 0],
                [Math.sin(angle),  Math.cos(angle), 0],
                [0              ,  0              , 1]
            ];
            var translation2Matrix = [
                [1, 0, boundLeft.x],
                [0, 1, boundLeft.y],
                [0, 0, 1          ]
            ];
            var transformationMatrix = translation1Matrix;
            transformationMatrix = this._multiplyMatrices(rotationMatrix, transformationMatrix, 3, 3, 3, 3);
            transformationMatrix = this._multiplyMatrices(translation2Matrix, transformationMatrix, 3, 3, 3, 3);

            pathVectors = _.map(pathVectors, function(pathVector) {
                return self._multiplyMatrices(transformationMatrix, pathVector, 3, 3, 1, 3);
            });

            // Convert to LatLng coordinates
            var pathLatLng = _.map(pathVectors, function(pathVector) {
                return new LatLng(
                    projectionUtils.tileYToLat(zoom, pathVector[1][0]),
                    projectionUtils.tileXToLng(zoom, pathVector[0][0])
                );
            });

            return new Polygon({
                path: pathLatLng,
                fillColor: 0xFF0070C0,
                strokeColor: 0xFF000000,
                strokeWidth: 1
            });
        },

        /**
         * Multiply two matrices.
         * @see http://rosettacode.org/wiki/Matrix_multiplication#JavaScript
         *
         * @private
         * @param {Array.<Array.<Number>>} matrix1
         * @param {Array.<Array.<Number>>} matrix2
         * @param {Number} matrix1Width
         * @param {Number} matrix1Height
         * @param {Number} matrix2Width
         * @param {Number} matrix2Height
         * @return {Array.<Array.<Number>>}
         */
        '_multiplyMatrices': function(matrix1, matrix2, matrix1Width, matrix1Height, matrix2Width, matrix2Height) {
            if (matrix1Width !== matrix2Height) {
                throw new Error('Incompatible sizes');
            }

            var result = [];
            for (var i = 0; i < matrix1Height; i++) {
                result[i] = [];
                for (var j = 0; j < matrix2Width; j++) {
                    var sum = 0;
                    for (var k = 0; k < matrix1Width; k++) {
                        sum += matrix1[i][k] * matrix2[k][j];
                    }
                    result[i][j] = sum;
                }
            }
            return result;
        }
    };

    return waypointPolygonBuilder;
});
