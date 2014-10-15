/**
 * Interface for services that provide places.
 *
 * @author Marc Plouhinec
 */

define(['../entity/Place'], function(Place) {
    /**
     * Interface for services that provide places.
     *
     * @interface
     */
    function PlaceProviderService() {
        throw new Error('Only sub-classes can be instanced.');
    }

    /**
     * Suggest places to the user when he's writing the query.
     *
     * @param {string} query
     * @param {function(query: string, Array.<Place>)} callback
     */
    PlaceProviderService.prototype.suggestPlaces = function(query, callback) {
        throw new Error('Unimplemented method.');
    };

    /**
     * Get more details about the given place.
     *
     * @param {Place} place
     * @param {function(place: Place)} callback
     */
    PlaceProviderService.prototype.getPlaceDetails = function(place, callback) {
        throw new Error('Unimplemented method.');
    };

    /**
     * Find one or more places for the given query.
     *
     * @param {string} query
     * @param {function(query: string, Array.<Place>)} callback
     */
    PlaceProviderService.prototype.findPlaces = function(query, callback) {
        throw new Error('Unimplemented method.');
    };

    /**
     * Provide a controller that can display details about a Place in the side panel (optional).
     *
     * @return {{showPlaceDetails: function(place: Place)}} controller or null if no controller exist.
     */
    PlaceProviderService.prototype.getPlaceDetailsController = function() {
        throw new Error('Unimplemented method.');
    };

    return PlaceProviderService;
});