/**
 * Provide public transport itineraries.
 *
 * @author Marc Plouhinec
 */

define([
    '../../../org/opentravelmate/entity/Place',
    '../../../org/opentravelmate/entity/itinerary/GeoPoint',
    '../../../org/opentravelmate/entity/itinerary/Itinerary',
    '../../../org/opentravelmate/service/ItineraryProviderService',
    '../../../org/opentravelmate/controller/dialog/DialogOptions',
    '../../../org/opentravelmate/controller/dialog/notificationController',
    './itineraryService'
], function(Place, GeoPoint, Itinerary, ItineraryProviderService, DialogOptions, notificationController, itineraryService) {


    /**
     * Provide public transport itineraries.
     *
     * @constructor
     * @implements {ItineraryProviderService}
     */
    function PublicTransportItineraryProviderService() {
    }

    /**
     * Find itineraries between the two given places at the given time.
     *
     * @param {Place} originPlace
     * @param {Place} destinationPlace
     * @param {string} dateTime in ISO 8601 format
     * @param {boolean} isDepartureTime
     * @param {function(Array.<Itinerary>)} callback
     */
    PublicTransportItineraryProviderService.prototype.findItineraries = function(originPlace, destinationPlace, dateTime, isDepartureTime, callback) {
        var originPoint = new GeoPoint({
            latitude: originPlace.latitude,
            longitude: originPlace.longitude
        });
        var destinationPoint = new GeoPoint({
            latitude: destinationPlace.latitude,
            longitude: destinationPlace.longitude
        });
        itineraryService.findItineraries(originPoint, destinationPoint, dateTime, isDepartureTime, function handleItineraryServiceResponse(error, itineraries) {
            if (error) {
                console.log(error.errorCode + ' ' + error.errorMessage);
                notificationController.showMessage('Error: unable to find itineraries. Please retry later.', 5000, new DialogOptions({}));
                return;
            }
            callback(itineraries);
        });
    };


    return PublicTransportItineraryProviderService;
});