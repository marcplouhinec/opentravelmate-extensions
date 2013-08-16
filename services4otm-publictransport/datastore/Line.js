/**
 * Define a Line.
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
    function Line(options) {
        /**
         * Internal ID.
         *
         * @type {String}
         */
        this.id = options.id;

        /**
         * Line name (e.g. '19').
         *
         * @type {String}
         */
        this.name = options.name;

        /**
         * ID of the Transport authority that manages this line.
         *
         * @type {String}
         */
        this.transportAuthorityId = options.transportAuthorityId;

        /**
         * Hexadecimal color code (e.g. 43FA7A).
         *
         * @type {String}
         */
        this.color = options.color;

        /**
         * Waypoint ID of the first line bound.
         *
         * @type {String}
         */
        this.direction1Id = options.direction1Id;

        /**
         * Waypoint ID of the second line bound.
         *
         * @type {String}
         */
        this.direction2Id = options.direction2Id;
    }

    return Line;
});
