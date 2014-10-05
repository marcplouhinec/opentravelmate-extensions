/**
 * Define a map marker.
 *
 * @author Marc Plouhinec
 */

define(['./LatLng', './Point', './MarkerIcon'], function(LatLng, Point, MarkerIcon) {
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
     *   icon: MarkerIcon=
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
        /** @type {?MarkerIcon} */
        this.icon = options.icon || null;
    }

    return Marker;
});
