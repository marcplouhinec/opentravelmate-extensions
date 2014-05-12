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
    '../google-itinerary-provider/GoogleItineraryProvider',
    './Services4otmPlaceProvider',
    './mapOverlayController'
], function(_, LatLng, ItineraryProvider, Itinerary, Path, Place, PlaceProvider, GoogleItineraryProvider, Services4otmPlaceProvider, mapOverlayController) {
    'use strict';

    /**
     * @constant
     * @type {String}
     */
    var ITINERARY_WS_URL = 'http://www.services4otm.com/itineraries';

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
        var self = this;

        mapOverlayController.showItinerary(itinerary);

        // Show the walking paths
        var googleItineraryProvider = ItineraryProvider.findByName(GoogleItineraryProvider.NAME);
        googleItineraryProvider.showItinerary(itinerary);
    };

    /**
     * Cancel the given itinerary for the user.
     *
     * @param {Itinerary} itinerary
     */
    Services4otmItineraryProvider.prototype.clearItinerary = function(itinerary) {
        // Remove the highlighted waypoints from the map
        mapOverlayController.clearItinerary();

        // Remove the walking paths
        var googleItineraryProvider = ItineraryProvider.findByName(GoogleItineraryProvider.NAME);
        googleItineraryProvider.clearItinerary(itinerary);
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

        var url = '' + ITINERARY_WS_URL;
        if (startingPlace.placeProvider.getName() === Services4otmPlaceProvider.NAME) {
            url += '/origin-stop/' + startingPlace.additionalParameters['waypointId'];
        } else {
            url += '/origin-latitude/' + startingPlace.latitude + '/origin-longitude/' + startingPlace.longitude;
        }
        if (destinationPlace.placeProvider.getName() === Services4otmPlaceProvider.NAME) {
            url += '/destination-stop/' + destinationPlace.additionalParameters['waypointId'];
        } else {
            url += '/destination-latitude/' + destinationPlace.latitude + '/destination-longitude/' + destinationPlace.longitude;
        }
        url += '?callback=?';
        $.getJSON(url, function (response) {
            // Stop if an error occurred
            if (!response.success) {
                callback({ error: response.errormessage });
                return;
            }

            // Parse the result
            var placeProvider = PlaceProvider.findByName(Services4otmPlaceProvider.NAME);
            var itineraries = _.map(response.itineraries, function(itinerary) {
                var steps = _.map(itinerary.steps, function(step) {
                    if (step.type === 'stop') {
                        return new Place({
                            latitude: step.latitude,
                            longitude: step.longitude,
                            name: step.stopName,
                            placeProvider: placeProvider,
                            additionalParameters: {
                                waypointId: step.waypointId
                            }
                        });
                    } else if (step.type === 'line') {
                        var waypoints = _.map(step.intermediateWaypointCoordinates, function(coordinates) {
                            return new LatLng(coordinates.latitude, coordinates.longitude);
                        });
                        return new Path({
                            waypoints: waypoints,
                            name: 'Line ' +  step.lineName,
                            color: step.lineColor,
                            additionalParameters: {
                                lineId: step.lineId
                            },
                            itineraryProvider: self
                        });
                    }
                });

                return new Itinerary({
                    steps: steps,
                    itineraryProvider: self
                });
            });

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
