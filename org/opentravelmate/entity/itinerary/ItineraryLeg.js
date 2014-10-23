/**
 * Define an itinerary leg.
 *
 * @author Marc Plouhinec
 */

define(['./GeoPoint'], function(GeoPoint) {
    'use strict';

    /**
     * Create a new ItineraryLeg.
     *
     * @param options
     * @constructor
     */
    function ItineraryLeg(options) {
        /**
         * Duration of the leg in second.
         *
         * @type {Number}
         */
        this.durationSecond = options.durationSecond;

        /**
         * Start date.
         *
         * @type {String}
         */
        this.startDateTime = options.startDateTime;

        /**
         * End date.
         *
         * @type {String}
         */
        this.endDateTime = options.endDateTime;

        /**
         * Distance of the leg in meter.
         *
         * @type {Number}
         */
        this.distanceMeter = options.distanceMeter;

        /**
         * Start point of the leg.
         *
         * @type {GeoPoint}
         */
        this.startPlacePoint = new GeoPoint(options.startPlacePoint);

        /**
         * Name of the start place.
         *
         * @type {String}
         */
        this.startPlaceName = options.startPlaceName;

        /**
         * ID of the stop where the leg starts (if applicable).
         *
         * @type {String}
         */
        this.startPlaceStopId = options.startPlaceStopId;

        /**
         * End point of the leg.
         *
         * @type {GeoPoint}
         */
        this.endPlacePoint = new GeoPoint(options.endPlacePoint);

        /**
         * Name of the end place.
         *
         * @type {String}
         */
        this.endPlaceName = options.endPlaceName;

        /**
         * ID of the stop where the leg ends (if applicable).
         *
         * @type {String}
         */
        this.endPlaceStopId = options.endPlaceStopId;

        /**
         * Tell if this leg use a vehicle (true) or not (false).
         *
         * @type {boolean}
         */
        this.isTransitLeg = options.isTransitLeg;

        /**
         * ID of the route agency (if applicable).
         *
         * @type {String}
         */
        this.agencyId = options.agencyId;

        /**
         * Name of the route agency (if applicable).
         *
         * @type {String}
         */
        this.agencyName = options.agencyName;

        /**
         * URL of the route agency (if applicable).
         *
         * @type {String}
         */
        this.agencyUrl = options.agencyUrl;

        /**
         * ID of the route (if applicable).
         *
         * @type {String}
         */
        this.routeId = options.routeId;

        /**
         * Type of the route (if applicable).
         *
         * @type {Number}
         */
        this.routeType = options.routeType;

        /**
         * Short name of the route (if applicable).
         *
         * @type {String}
         */
        this.routeShortName = options.routeShortName;

        /**
         * Long name of the route (if applicable).
         *
         * @type {String}
         */
        this.routeLongName = options.routeLongName;

        /**
         * Hexadecimal color code (e.g. 43FA7A) of the route (if applicable).
         *
         * @type {String}
         */
        this.routeColor = options.routeColor;

        /**
         * Text displayed on the vehicle (if applicable).
         *
         * @type {String}
         */
        this.headsign = options.headsign;

        /**
         * Points to display a poly-line on the map.
         *
         * @type {Array.<GeoPoint>}
         */
        this.points = [];
        for (var i = 0; i < options.points.length; i++) {
            this.points.push(new GeoPoint(options.points[i]));
        }
    }

    return ItineraryLeg;
});
