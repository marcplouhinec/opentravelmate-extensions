/**
 * Provide places by querying Google.
 *
 * @author Marc Plouhinec
 */

define([
    '../../../org/opentravelmate/controller/widget/Widget',
    '../../../org/opentravelmate/controller/widget/map/Map',
    '../../../org/opentravelmate/entity/Place',
    '../../../org/opentravelmate/service/PlaceProviderService'
], function(Widget, Map, Place, PlaceProviderService) {

    var google = window.google;

    /**
     * Google Places AutoCompleteService.
     *
     * @type {google.maps.places.AutocompleteService}
     */
    var autoCompleteService = new google.maps.places.AutocompleteService();

    /**
     * Provide places by querying Google.
     *
     * @constructor
     * @implements {PlaceProviderService}
     */
    function GooglePlaceProviderService() {
    }

    /**
     * Suggest places to the user when he's writing the query.
     *
     * @param {string} query
     * @param {function(query: string, Array.<Place>)} callback
     */
    GooglePlaceProviderService.prototype.suggestPlaces = function(query, callback) {
        var self = this;

        var map = /** @type {Map} */ Widget.findById('map');
        var mapBounds = map.getBounds();
        var gBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(mapBounds.sw.lat, mapBounds.sw.lng),
            new google.maps.LatLng(mapBounds.ne.lat, mapBounds.ne.lng));
        autoCompleteService.getPlacePredictions({input: query, bounds: gBounds}, function (predictions, status) {
            if (status !== 'OK') { return; }

            var places = /** @type {Array.<Place>} */[];
            for (var i = 0; i < predictions.length; i++) {
                var prediction = predictions[i];
                places.push(new Place({
                    latitude: 0,
                    longitude: 0,
                    name: prediction.description,
                    additionalParameters: {
                        reference: prediction.reference
                    }
                }));
            }
            callback(query, places);
        });
    };

    return GooglePlaceProviderService;
});