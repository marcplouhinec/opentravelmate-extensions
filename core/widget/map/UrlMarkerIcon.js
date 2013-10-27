/**
 * Define an URL map marker icon.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(['./MarkerIcon', './Dimension'], function(MarkerIcon, Dimension) {
    'use strict';

    /**
     * Create a new UrlMarkerIcon.
     *
     * @param {{
     *   anchor: Point,
     *   size: Dimension,
     *   url: String
     * }} options
     * @constructor
     */
    function UrlMarkerIcon(options) {
        MarkerIcon.call(this, options);

        /** @type {String} */
        this.url = options.url;
    }

    UrlMarkerIcon.protype = new MarkerIcon();
    UrlMarkerIcon.protype.constructor = UrlMarkerIcon;

    return UrlMarkerIcon;
});
