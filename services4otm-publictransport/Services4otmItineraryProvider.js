/**
 * Provide itineraries by using the www.services4otm.com web services.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'underscore',
    '../itinerary-finder/ItineraryProvider',
    './Services4otmPlaceProvider'
], function(_, ItineraryProvider, Services4otmPlaceProvider) {
    'use strict';

    /**
     * @constant
     * @type {String}
     */
    var ITINERARY_WS_URL = 'http://www.services4otm.com/itinerary/publictransport/';

    /**
     * Create the itinerary provider.
     *
     * @constructor
     * @extends ItineraryProvider
     */
    function Services4otmItineraryProvider() {
        ItineraryProvider.register(this);
    }

    Services4otmItineraryProvider.prototype = new ItineraryProvider();
    Services4otmItineraryProvider.prototype.constructor = Services4otmItineraryProvider;

    /**
     * @constant
     * @type {string}
     */
    Services4otmItineraryProvider.NAME = 'services4otm-publictransport/Services4otmItineraryProvider';

    /**
     * Get the itinerary provider name.
     *
     * @return {String}
     */
    Services4otmItineraryProvider.prototype.getName = function() {
        return Services4otmItineraryProvider.NAME;
    };

    /**
     * Find itineraries for the given startingPlace and destinationPlace.
     *
     * @param {Place} startingPlace
     * @param {Place} destinationPlace
     * @param {function(result: {error: String=, itineraries: Array.<Itinerary>=})} callback
     */
    Services4otmItineraryProvider.prototype.findItineraries = function(startingPlace, destinationPlace, callback) {
        var self = this;
        var startPoint = startingPlace.placeProvider.getName() === Services4otmPlaceProvider.NAME ?
            startingPlace.additionalParameters['waypointId'] :
            {'latitude': startingPlace.latitude, 'longitude': startingPlace.longitude};
        var endPoint = destinationPlace.placeProvider.getName() === Services4otmPlaceProvider.NAME ?
            destinationPlace.additionalParameters['waypointId'] :
            {'latitude': destinationPlace.latitude, 'longitude': destinationPlace.longitude};
        var url = ITINERARY_WS_URL + '?' +
            (_.isString(startPoint) ? 'startWaypointId=' + startPoint : 'startLocation=' + JSON.stringify(startPoint)) + '&' +
            (_.isString(endPoint) ? 'endWaypointId=' + endPoint : 'endLocation=' + JSON.stringify(endPoint)) +
            '&include_docs=true&jsoncallback=?';
        $.getJSON(url, function (itineraryInformation) {
            //Stop if an error occurred
            if (itineraryInformation.error) {
                callback({ error: itineraryInformation.error });
                return;
            }

            // TODO handle the results
            console.log(itineraryInformation);
        });
    };

    return Services4otmItineraryProvider;
});
