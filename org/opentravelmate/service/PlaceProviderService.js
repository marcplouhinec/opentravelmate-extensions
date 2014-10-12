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

    return PlaceProviderService;
});