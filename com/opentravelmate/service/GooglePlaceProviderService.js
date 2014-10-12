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
     * Google Places PlacesService.
     *
     * @type {google.maps.places.PlacesService}
     */
    var placesService = new google.maps.places.PlacesService(document.createElement('div'));

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
                    provider: self,
                    additionalParameters: {
                        reference: prediction.reference
                    }
                }));
            }
            callback(query, places);
        });
    };

    /**
     * Get more details about the given place.
     *
     * @param {Place} place
     * @param {function(place: Place)} callback
     */
    GooglePlaceProviderService.prototype.getPlaceDetails = function(place, callback) {
        placesService.getDetails({
            reference: place.additionalParameters['reference']
        }, function(googlePlace, status) {
            if (status !== 'OK') { callback(place); return; }

            var latlng = googlePlace.geometry.location;
            place.latitude = latlng.lat();
            place.longitude = latlng.lng();
            place.additionalParameters['formatted_address'] = googlePlace['formatted_address'];
            callback(place);
        });
    };

    /**
     * Find one or more places for the given query.
     *
     * @param {String} query
     * @param {function(query: string, Array.<Place>)} callback
     */
    GooglePlaceProviderService.prototype.findPlaces = function(query, callback) {
        var self = this;

        var map = /** @type {Map} */ Widget.findById('map');
        var mapBounds = map.getBounds();
        var gBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(mapBounds.sw.lat, mapBounds.sw.lng),
            new google.maps.LatLng(mapBounds.ne.lat, mapBounds.ne.lng));

        placesService.textSearch({bounds: gBounds, query: query}, function(googlePlaces) {
            var places = [];
            for (var i = 0; i < googlePlaces.length; i++) {
                var googlePlace = googlePlaces[i];
                var latlng = googlePlace.geometry.location;
                places.push(new Place({
                    latitude: latlng.lat(),
                    longitude: latlng.lng(),
                    name: googlePlace.name,
                    provider: self,
                    additionalParameters: {
                        reference: googlePlace.reference,
                        formatted_address: googlePlace.formatted_address
                    }
                }));
            }
            callback(query, places);
        });
    };

    return GooglePlaceProviderService;
});