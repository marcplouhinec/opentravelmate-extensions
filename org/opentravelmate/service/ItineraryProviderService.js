/**
 * Interface for services that provide itineraries.
 *
 * @author Marc Plouhinec
 */

define(['../entity/Place', '../entity/itinerary/Itinerary'], function(Place, Itinerary) {
    /**
     * Interface for services that provide itineraries.
     *
     * @interface
     */
    function ItineraryProviderService() {
        throw new Error('Only sub-classes can be instanced.');
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
    ItineraryProviderService.prototype.findItineraries = function(originPlace, destinationPlace, dateTime, isDepartureTime, callback) {
        throw new Error('Unimplemented method.');
    };

    /**
     * Function called when the details of an itinerary are shown.
     *
     * @param {Itinerary} itinerary
     */
    ItineraryProviderService.prototype.onItineraryDetailsShown = function(itinerary) {
        throw new Error('Unimplemented method.');
    };

    /**
     * Function called when the details of an itinerary are not shown anymore.
     *
     * @param {Itinerary} itinerary
     */
    ItineraryProviderService.prototype.onItineraryDetailsCleared = function(itinerary) {
        throw new Error('Unimplemented method.');
    };

    return ItineraryProviderService;
});