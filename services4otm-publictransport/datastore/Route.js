/**
 * Define a Route.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    'use strict';

    /**
     * Create a new Line.
     *
     * @param options
     * @constructor
     */
    function Route(options) {
        /**
         * Internal ID.
         *
         * @type {String}
         */
        this.id = options.id;

        /**
         * ID of the agency that manages this line.
         *
         * @type {String}
         */
        this.agencyId = options.agencyId;

        /**
         * Line short name (e.g. '4').
         *
         * @type {String}
         */
        this.shortName = options.shortName;

        /**
         * Line long name (e.g. 'Boy Konen/LT.Mich.Lucius').
         *
         * @type {String}
         */
        this.longName = options.longName;

        /**
         * Hexadecimal color code (e.g. 43FA7A).
         *
         * @type {String}
         */
        this.color = options.color;
    }

    return Route;
});
