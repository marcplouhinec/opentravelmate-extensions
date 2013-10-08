/**
 * Define the interfaces for objects that provide place information for the place and itinerary finders.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/utils/I18nError',
    '../core/utils/ErrorCode',
    './Place'
], function(I18nError, ErrorCode, Place) {
    'use strict';

    /**
     * @type {Object.<String, PlaceProvider>}
     */
    var placeProviderByName = {};

    /**
     * Create a PlaceProvider.
     *
     * @constructor
     */
    function PlaceProvider() {
    }

    /**
     * Find a PlaceProvider by its name.
     *
     * @static
     * @param {String} name
     * @return {PlaceProvider=}
     */
    PlaceProvider.findByName = function(name) {
        return placeProviderByName[name];
    };

    /**
     * Register a place provider.
     * Note: this function is normally called by the place provider themselves in their constructor.
     *
     * @param {PlaceProvider} placeProvider
     */
    PlaceProvider.register = function(placeProvider) {
        placeProviderByName[placeProvider.getName()] = placeProvider;
    };

    /**
     * Get the place provider name.
     * Note: the name must be formatted like 'extension-name/ClassName'.
     *
     * @return {String}
     */
    PlaceProvider.prototype.getName = function() {
        throw new I18nError({ code: ErrorCode.UNIMPLEMENTED_METHOD, i18nArgs: ['PlaceProvider.prototype.getName'] });
    };

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

    /**
     * Get more details for the given place.
     *
     * @param {Place} place
     * @param {function(place: Place)} callback
     */
    PlaceProvider.prototype.getPlaceDetails = function(place, callback) {
        throw new I18nError({ code: ErrorCode.UNIMPLEMENTED_METHOD, i18nArgs: ['PlaceProvider.prototype.getPlaceDetails'] });
    };

    /**
     * Show the details of the given place in a new SubWebView (with the provided place holder).
     *
     * @param {Place} place
     * @param {HTMLDivElement} subWebViewPlaceHolder
     */
    PlaceProvider.prototype.showPlaceDetails = function(place, subWebViewPlaceHolder) {
        throw new I18nError({ code: ErrorCode.UNIMPLEMENTED_METHOD, i18nArgs: ['PlaceProvider.prototype.showPlaceDetails'] });
    };

    return PlaceProvider;
});
