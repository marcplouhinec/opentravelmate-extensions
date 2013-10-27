/**
 * Define an marker icon defined with an SVG path element.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(['./MarkerIcon', './Dimension'], function(MarkerIcon, Dimension) {
    'use strict';

    /**
     * Create a new UrlMarkerIcon.
     *
     * @param {{
     *     anchor: Point,
     *     size: Dimension,
     *     fillColor: String=,
     *     fillOpacity: Number=,
     *     path: String,
     *     rotation: Number=,
     *     scale: Number=,
     *     strokeColor: String=,
     *     strokeOpacity: Number=,
     *     strokeWeight: Number=
     * }} options
     * @constructor
     */
    function VectorMarkerIcon(options) {
        MarkerIcon.call(this, options);

        /**
         * Shape fill color.
         *
         * @type {String}
         */
        this.fillColor = options.fillColor || 'black';

        /**
         * Shape fill opacity (number between 0 = transparent and 1 = opaque).
         *
         * @type {Number}
         */
        this.fillOpacity = options.fillOpacity || 0;

        /**
         * Shape path.
         *
         * @see http://www.w3.org/TR/SVG/paths.html
         * @type {String}
         */
        this.path = options.path;

        /**
         * Rotation angle in degree.
         *
         * @type {Number}
         */
        this.rotation = options.rotation || 0;

        /**
         * Scaling factor.
         *
         * @type {Number}
         */
        this.scale = options.scale || 1;

        /**
         * Shape stroke color.
         *
         * @type {String}
         */
        this.strokeColor = options.strokeColor || 'black';

        /**
         * Shape stroke opacity (number between 0 = transparent and 1 = opaque).
         *
         * @type {Number}
         */
        this.strokeOpacity = options.strokeOpacity || 1;

        /**
         * Shape stroke width.
         *
         * @type {Number}
         */
        this.strokeWeight = options.strokeWeight || this.scale;
    }

    VectorMarkerIcon.protype = new MarkerIcon();
    VectorMarkerIcon.protype.constructor = VectorMarkerIcon;

    return VectorMarkerIcon;
});
