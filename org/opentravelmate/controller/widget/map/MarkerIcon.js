/**
 * Define a map marker icon.
 *
 * @author Marc Plouhinec
 */

define(['./Point'], function(Point) {
    'use strict';

    /**
     * Create a new MarkerIcon.
     *
     * @param {{
     *   anchor: Point,
     *   size: Dimension
     * }} options
     * @constructor
     */
    function MarkerIcon(options) {
        if (!options) {
            return;
        }
        /**
         * The position of the marker icon on the map starting from the marker position.
         * The default value is "new Point(width/2, height)".
         *
         * @type {Point}
         */
        this.anchor = options.anchor;

        /** @type {Dimension} */
        this.size = options.size;
    }

    return MarkerIcon;
});
