/**
 * Define the interfaces for objects that provide place information for the place and itinerary finders.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'core/utils/I18nError',
    'core/utils/ErrorCode',
    './Place'
], function(I18nError, ErrorCode, Place) {
    'use strict';

    /**
     * Create a PlaceProvider.
     *
     * @constructor
     */
    function PlaceProvider() {
    }

    /**
     * Suggest places to the user when he's still writing the query.
     *
     * @param {String} query
     * @param {function(Array.<Place>)} callback
     */
    PlaceProvider.prototype.suggestPlaces = function(query, callback) {
        throw new I18nError({ code: ErrorCode.UNIMPLEMENTED_METHOD, i18nArgs: ['PlaceProvider.prototype.suggestPlaces'] });
    };

    /**
     * Find one or more places for the given query.
     *
     * @param {String} query
     * @param {function(Array.<Place>)} callback
     */
    PlaceProvider.prototype.findPlaces = function(query, callback) {
        throw new I18nError({ code: ErrorCode.UNIMPLEMENTED_METHOD, i18nArgs: ['PlaceProvider.prototype.findPlace'] });
    };

    return PlaceProvider;
});
