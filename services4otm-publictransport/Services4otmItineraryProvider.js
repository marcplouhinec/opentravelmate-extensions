/**
 * Provide itineraries by using the www.services4otm.com web services.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'underscore',
    '../itinerary-finder/ItineraryProvider',
    '../itinerary-finder/Itinerary',
    '../itinerary-finder/Path',
    '../place-commons/Place',
    '../place-commons/PlaceProvider',
    './Services4otmPlaceProvider'
], function(_, ItineraryProvider, Itinerary, Path, Place, PlaceProvider, Services4otmPlaceProvider) {
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
            '&callback=?';
        $.getJSON(url, function (response) {
            //Stop if an error occurred
            if (!response.success) {
                callback({ error: response.errormessage });
                return;
            }

            // Parse the result
            var itineraries = [];
            var placeProvider = PlaceProvider.findByName(Services4otmPlaceProvider.NAME);
            var steps = _.map(response.itinerary.steps, function(step) {
                if (step.type === 'Place') {
                    step.placeProvider = placeProvider;
                    return new Place(step);
                } else {
                    var places = _.map(step.places, function(place) {
                        place.placeProvider = placeProvider;
                        return new Place(place);
                    });
                    return new Path({
                        places: places,
                        name: step.name,
                        color: step.color,
                        additionalParameters: step.additionalParameters
                    });
                }
            });
            itineraries.push(new Itinerary({
                steps: steps,
                itineraryProvider: self
            }));

            // Return the results
            callback({
                itineraries: itineraries
            });
        });
    };

    return Services4otmItineraryProvider;
});
