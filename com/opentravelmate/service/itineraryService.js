/**
 * Provide public transport itineraries.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    'lodash',
    '../../../org/opentravelmate/entity/itinerary/GeoPoint',
    '../../../org/opentravelmate/entity/itinerary/Itinerary',
    '../entity/WSError'
], function($, _, GeoPoint, Itinerary, WSError) {
    'use strict';

    /**
     * Provide public transport itineraries.
     */
    var itineraryService = {

        /**
         * Find the itineraries between the given points at the given time.
         *
         * @param {GeoPoint} originPoint
         * @param {GeoPoint} destinationPoint
         * @param {string} dateTime in the ISO 8601 format
         * @param {boolean} isDepartureTime
         * @param {function(error: WSError|undefined, itineraries: Array.<Itinerary>)} callback
         */
        'findItineraries' : function(originPoint, destinationPoint, dateTime, isDepartureTime, callback) {
            var url = 'http://www.opentravelmate.io/itineraries' +
                '/fromLat/' + originPoint.latitude + '/fromLng/' + originPoint.longitude +
                '/toLat/' + destinationPoint.latitude + '/toLng/' + destinationPoint.longitude +
                '/?dateTime=' + encodeURIComponent(dateTime) +
                '&isDepartureTime=' + (isDepartureTime ? 'true' : 'false') +
                '&callback=?';
            $.getJSON(url, function (response) {
                if (response.errorMessage) {
                    return callback(new WSError(result.httpStatus, result.errorMessage), []);
                }

                var itineraries = _.map(response, function(itinerary) {
                    return new Itinerary(itinerary);
                });

                callback(undefined, itineraries);
            });
        }

    };

    return itineraryService;
});
