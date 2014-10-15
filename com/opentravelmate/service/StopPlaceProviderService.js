/**
 * Provide places related to a stop.
 *
 * @author Marc Plouhinec
 */

define([
    '../../../org/opentravelmate/entity/Place',
    '../../../org/opentravelmate/service/PlaceProviderService'
], function(Place, PlaceProviderService) {


    /**
     * Provide places related to a stop.
     *
     * @constructor
     * @implements {PlaceProviderService}
     * @param {stopPlaceDetailsController} stopPlaceDetailsController
     */
    function StopPlaceProviderService(stopPlaceDetailsController) {
        this._stopPlaceDetailsController = stopPlaceDetailsController;
    }

    /**
     * Suggest places to the user when he's writing the query.
     *
     * @param {string} query
     * @param {function(query: string, Array.<Place>)} callback
     */
    StopPlaceProviderService.prototype.suggestPlaces = function(query, callback) {
        callback(query, []);
    };

    /**
     * Get more details about the given place.
     *
     * @param {Place} place
     * @param {function(place: Place)} callback
     */
    StopPlaceProviderService.prototype.getPlaceDetails = function(place, callback) {
        callback(null);
    };

    /**
     * Find one or more places for the given query.
     *
     * @param {string} query
     * @param {function(query: string, Array.<Place>)} callback
     */
    StopPlaceProviderService.prototype.findPlaces = function(query, callback) {
        callback(query, []);
    };

    /**
     * Provide a controller that can display details about a Place in the side panel (optional).
     *
     * @return {{showPlaceDetails: function(place: Place)}} controller or null if no controller exist.
     */
    StopPlaceProviderService.prototype.getPlaceDetailsController = function() {
        return this._stopPlaceDetailsController;
    };

    return StopPlaceProviderService;
});