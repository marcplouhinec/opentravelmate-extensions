/**
 * Define the interface for objects that provide itineraries.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/utils/I18nError',
    '../core/utils/ErrorCode'
], function(I18nError, ErrorCode) {
    'use strict';

    /**
     * @type {Object.<String, ItineraryProvider>}
     */
    var itineraryProviderByName = {};

    /**
     * Create a new ItineraryProvider.
     *
     * @param options
     * @constructor
     */
    function ItineraryProvider() {
    }

    /**
     * Find an ItineraryProvider by its name.
     *
     * @static
     * @param {String} name
     * @return {ItineraryProvider=}
     */
    ItineraryProvider.findByName = function(name) {
        return itineraryProviderByName[name];
    };

    /**
     * Register an itinerary provider.
     * Note: this function is normally called by the itinerary provider themselves in their constructor.
     *
     * @param {ItineraryProvider} itineraryProvider
     */
    ItineraryProvider.register = function(itineraryProvider) {
        itineraryProviderByName[itineraryProvider.getName()] = itineraryProvider;
    };

    /**
     * Get the itinerary provider name.
     * Note: the name must be formatted like 'extension-name/ClassName'.
     *
     * @return {String}
     */
    ItineraryProvider.prototype.getName = function() {
        throw new I18nError({ code: ErrorCode.UNIMPLEMENTED_METHOD, i18nArgs: ['ItineraryProvider.prototype.getName'] });
    };

    /**
     * Find itineraries for the given startingPlace and destinationPlace.
     *
     * @param {Place} startingPlace
     * @param {Place} destinationPlace
     * @param {function(result: {error: String=, itineraries: Array.<Itinerary>=})} callback
     */
    ItineraryProvider.prototype.findItineraries = function(startingPlace, destinationPlace, callback) {
        throw new I18nError({ code: ErrorCode.UNIMPLEMENTED_METHOD, i18nArgs: ['ItineraryProvider.prototype.findItineraries'] });
    };

    /**
     * Show the given itinerary to the user.
     *
     * @param {Itinerary} itinerary
     */
    ItineraryProvider.prototype.showItinerary = function(itinerary) {
        throw new I18nError({ code: ErrorCode.UNIMPLEMENTED_METHOD, i18nArgs: ['ItineraryProvider.prototype.showItinerary'] });
    };

    /**
     * Cancel the given itinerary for the user.
     *
     * @param {Itinerary} itinerary
     */
    ItineraryProvider.prototype.clearItinerary = function(itinerary) {
        throw new I18nError({ code: ErrorCode.UNIMPLEMENTED_METHOD, i18nArgs: ['ItineraryProvider.prototype.clearItinerary'] });
    };

    return ItineraryProvider;
});
