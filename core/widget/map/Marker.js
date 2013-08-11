/**
 * Define a map marker.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(['./LatLng', './Point'], function(LatLng, Point) {
    'use strict';

    /**
     * Counter used to generate unique IDs.
     *
     * @type {Number}
     */
    var nextMarkerId = 0;

    /**
     * Create a new marker.
     *
     * @param {{
     *   position: LatLng,
     *   title: String,
     *   anchorPoint: Point=,
     * }} options
     * @constructor
     */
    function Marker(options) {
        /** @type {number} */
        this.id = nextMarkerId++;

        /** @type {LatLng} */
        this.position = options.position;
        /** @type {String} */
        this.title = options.title;
        /** @type {?Point} */
        this.anchorPoint = options.anchorPoint || null;
    }

    return Marker;
});
