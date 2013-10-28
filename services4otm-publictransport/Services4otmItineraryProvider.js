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
    '../google-itinerary-provider/GoogleItineraryProvider',
    './Services4otmPlaceProvider'
], function(_, ItineraryProvider, Itinerary, Path, Place, PlaceProvider, GoogleItineraryProvider, Services4otmPlaceProvider) {
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
        this._computePublicTransportItineraries(startingPlace, destinationPlace, function(result) {
            if (result.error) {
                return callback(result);
            }

            // Find the itinerary from the starting place to the first station by walk
            self._computeWalkingItineraryFromStartingPlaceToFirstStation(startingPlace, result.itineraries[0], function() {
                self._computeWalkingItineraryFromLastStationToDestinationPlace(destinationPlace, result.itineraries[0], function() {
                    callback(result);
                });
            });
        });
    };

    /**
     * Show the given itinerary to the user.
     *
     * @param {Itinerary} itinerary
     */
    Services4otmItineraryProvider.prototype.showItinerary = function(itinerary) {
        // TODO
    };

    /**
     * Find itineraries by using public transports for the given startingPlace and destinationPlace.
     *
     * @param {Place} startingPlace
     * @param {Place} destinationPlace
     * @param {function(result: {error: String=, itineraries: Array.<Itinerary>=})} callback
     * @private
     */
    Services4otmItineraryProvider.prototype._computePublicTransportItineraries = function(startingPlace, destinationPlace, callback) {
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
                        additionalParameters: step.additionalParameters,
                        itineraryProvider: self
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

    /**
     * Find the itinerary from the starting place to the first station by walk.
     *
     * @param {Place} startingPlace
     * @param {Itinerary} itinerary
     * @param {Function} callback
     * @private
     */
    Services4otmItineraryProvider.prototype._computeWalkingItineraryFromStartingPlaceToFirstStation = function(startingPlace, itinerary, callback) {
        // Do nothing if the starting place is the first station
        var firstStation = itinerary.steps[0];
        if (startingPlace.latitude === firstStation.latitude && startingPlace.longitude === firstStation.longitude) {
            return callback();
        }

        // Use the Google services to find the itinerary
        var googleItineraryProvider = ItineraryProvider.findByName(GoogleItineraryProvider.NAME);
        googleItineraryProvider.findItineraries(startingPlace, firstStation, function(result) {
            if (!result.error) {
                // Insert the computed itinerary
                itinerary.steps.splice(0, 0, startingPlace, result.itineraries[0].steps[1]);
            }
            callback();
        });
    };

    /**
     * Find the itinerary from the last station to the destination place by walk.
     *
     * @param {Place} destinationPlace
     * @param {Itinerary} itinerary
     * @param {Function} callback
     * @private
     */
    Services4otmItineraryProvider.prototype._computeWalkingItineraryFromLastStationToDestinationPlace = function(destinationPlace, itinerary, callback) {
        // Do nothing if the last station is the destination place
        var lastStation = itinerary.steps[itinerary.steps.length - 1];
        if (destinationPlace.latitude === lastStation.latitude && destinationPlace.longitude === lastStation.longitude) {
            return callback();
        }

        // Use the Google services to find the itinerary
        var googleItineraryProvider = ItineraryProvider.findByName(GoogleItineraryProvider.NAME);
        googleItineraryProvider.findItineraries(lastStation, destinationPlace, function(result) {
            if (!result.error) {
                // Insert the computed itinerary
                itinerary.steps.push(result.itineraries[0].steps[1]);
                itinerary.steps.push(destinationPlace);
            }
            callback();
        });
    };

    return Services4otmItineraryProvider;
});
