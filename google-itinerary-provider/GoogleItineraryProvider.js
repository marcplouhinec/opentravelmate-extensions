/**
 * Provide itineraries by using Google services.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../itinerary-finder/ItineraryProvider',
    '../itinerary-finder/Itinerary',
    '../itinerary-finder/Path',
    'async!http://maps.googleapis.com/maps/api/js?libraries=places&sensor=true!callback'
], function(ItineraryProvider, Itinerary, Path) {
    'use strict';

    var google = window.google;

    var directionsService = new google.maps.DirectionsService();

    /**
     * Create the itinerary provider.
     *
     * @constructor
     * @extends ItineraryProvider
     */
    function GoogleItineraryProvider() {
        ItineraryProvider.register(this);
    }

    GoogleItineraryProvider.prototype = new ItineraryProvider();
    GoogleItineraryProvider.prototype.constructor = GoogleItineraryProvider;

    /**
     * @constant
     * @type {string}
     */
    GoogleItineraryProvider.NAME = 'google-itinerary-provider/GoogleItineraryProvider';

    /**
     * Get the itinerary provider name.
     *
     * @return {String}
     */
    GoogleItineraryProvider.prototype.getName = function() {
        return GoogleItineraryProvider.NAME;
    };

    /**
     * Find itineraries for the given startingPlace and destinationPlace.
     *
     * @param {Place} startingPlace
     * @param {Place} destinationPlace
     * @param {function(result: {error: String=, itineraries: Array.<Itinerary>=})} callback
     */
    GoogleItineraryProvider.prototype.findItineraries = function(startingPlace, destinationPlace, callback) {
        var self = this;

        directionsService.route({
            'origin': new google.maps.LatLng(startingPlace.latitude, startingPlace.longitude),
            'destination': new google.maps.LatLng(destinationPlace.latitude, destinationPlace.longitude),
            'travelMode': google.maps.TravelMode.WALKING
        }, function(result, status) {
            if (status !== google.maps.DirectionsStatus.OK) {
                return callback({
                    error: 'Unable to compute an itinerary between ' + startingPlace.name + ' and ' + destinationPlace.name + '.'
                });
            }

            var path = new Path({
                name: result.routes[0].legs[0].distance.text,
                color: '1E90FF',
                places: [],
                additionalParameters: {
                    rawResult: result
                },
                itineraryProvider: self
            });
            callback({
                itineraries: [
                    new Itinerary({
                        steps: [startingPlace, path, destinationPlace],
                        itineraryProvider: self
                    })
                ]
            });
        });
    };

    /**
     * Show the given itinerary to the user.
     *
     * @param {Itinerary} itinerary
     */
    GoogleItineraryProvider.prototype.showItinerary = function(itinerary) {
        // TODO
    };

    return GoogleItineraryProvider;
});
