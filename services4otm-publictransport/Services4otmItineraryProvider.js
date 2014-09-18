/**
 * Provide itineraries by using the www.services4otm.com web services.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'underscore',
    '../core/widget/map/LatLng',
    '../itinerary-finder/ItineraryProvider',
    '../itinerary-finder/Itinerary',
    '../itinerary-finder/Path',
    '../place-commons/Place',
    '../place-commons/PlaceProvider',
    './Services4otmPlaceProvider',
    './mapOverlayController'
], function(_, LatLng, ItineraryProvider, Itinerary, Path, Place, PlaceProvider, Services4otmPlaceProvider, mapOverlayController) {
    'use strict';

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

        var url = 'http://www.opentravelmate.io/itineraries' +
            '/fromLat/' + startingPlace.latitude + '/fromLng/' + startingPlace.longitude +
            '/toLat/' + destinationPlace.latitude + '/toLng/' + destinationPlace.longitude + '/?callback=?';
        $.getJSON(url, function (response) {
            // Stop if an error occurred
            if (response.errorMessage) {
                return callback({ error: response.errorMessage });
            }

            // Parse the result
            var placeProvider = PlaceProvider.findByName(Services4otmPlaceProvider.NAME);
            var itineraries = _.map(response, function(itinerary) {
                itinerary.itineraryProvider = self;
                return new Itinerary(itinerary);
            });

            // Return the results
            callback({
                itineraries: itineraries
            });
        });
    };

    /**
     * Show the given itinerary to the user.
     *
     * @param {Itinerary} itinerary
     */
    Services4otmItineraryProvider.prototype.showItinerary = function(itinerary) {
        mapOverlayController.showItinerary(itinerary);
    };

    /**
     * Cancel the given itinerary for the user.
     *
     * @param {Itinerary} itinerary
     */
    Services4otmItineraryProvider.prototype.clearItinerary = function(itinerary) {
        mapOverlayController.clearItinerary();
    };

    return Services4otmItineraryProvider;
});
