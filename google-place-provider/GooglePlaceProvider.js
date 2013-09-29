/**
 * Provide places by using Google services.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    '../core/widget/Widget',
    '../core/widget/webview/SubWebView',
    '../place-commons/PlaceProvider',
    '../place-commons/Place',
    './google-place-details-subwebview/constants',
    'async!http://maps.googleapis.com/maps/api/js?libraries=places&sensor=true!callback'
], function(Widget, SubWebView, PlaceProvider, Place, placeDetailsSubWebViewConstants) {
    'use strict';

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
     * Create a place provider that use Google services.
     *
     * @constructor
     * @extends PlaceProvider
     */
    function GooglePlaceProvider() {
    }

    GooglePlaceProvider.prototype = new PlaceProvider();
    GooglePlaceProvider.prototype.constructor = GooglePlaceProvider;

    /**
     * Suggest places to the user when he's still writing the query.
     *
     * @param {String} query
     * @param {function(Array.<Place>)} callback
     */
    GooglePlaceProvider.prototype.suggestPlaces = function(query, callback) {
        var self = this;

        var map = /** @type {Map} */ Widget.findById('map');
        var mapBounds = map.getBounds();
        var gBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(mapBounds.sw.lat, mapBounds.sw.lng),
            new google.maps.LatLng(mapBounds.ne.lat, mapBounds.ne.lng));
        autoCompleteService.getPlacePredictions({input: query, bounds: gBounds}, function (predictions, status) {
            if (status === 'OK') {
                var places = [];
                for (var i = 0; i < predictions.length; i += 1) {
                    var prediction = predictions[i];
                    places.push(new Place({
                        latitude: 0,
                        longitude: 0,
                        name: prediction.description,
                        accuracy: 0.5,
                        placeProvider: self,
                        additionalParameters: {
                            reference: prediction.reference
                        }
                    }));
                }
                callback(places);
            }
        });
    };

    /**
     * Find one or more places for the given query.
     *
     * @param {String} query
     * @param {function(Array.<Place>)} callback
     */
    GooglePlaceProvider.prototype.findPlaces = function(query, callback) {
        var self = this;

        var map = /** @type {Map} */ Widget.findById('map');
        var mapBounds = map.getBounds();
        var gBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(mapBounds.sw.lat, mapBounds.sw.lng),
            new google.maps.LatLng(mapBounds.ne.lat, mapBounds.ne.lng));

        placesService.textSearch({bounds: gBounds, query: query}, function(googlePlaces) {
            var places = [];
            for (var i = 0; i < googlePlaces.length; i += 1) {
                var googlePlace = googlePlaces[i];
                var latlng = googlePlace.geometry.location;
                places.push(new Place({
                    latitude: latlng.lat(),
                    longitude: latlng.lng(),
                    name: googlePlace.name,
                    accuracy: 0.5,
                    placeProvider: self,
                    additionalParameters: {
                        reference: googlePlace.reference,
                        formatted_address: googlePlace.formatted_address
                    }
                }));
            }
            callback(places);
        });
    };

    /**
     * Get more details for the given place.
     *
     * @param {Place} place
     * @param {function(place: Place)} callback
     */
    GooglePlaceProvider.prototype.getPlaceDetails = function(place, callback) {
        placesService.getDetails({
            reference: place.additionalParameters['reference']
        }, function(googlePlace, status) {
            if (status !== 'OK') {
                callback(place);
                return;
            }

            var latlng = googlePlace.geometry.location;
            place.latitude = latlng.lat();
            place.longitude = latlng.lng();
            place.additionalParameters['formatted_address'] = googlePlace['formatted_address'];
            callback(place);
        });
    };

    /**
     * Show the details of the given place in a new SubWebView (with the provided place holder).
     *
     * @param {Place} place
     * @param {HTMLDivElement} subWebViewPlaceHolder
     */
    GooglePlaceProvider.prototype.showPlaceDetails = function(place, subWebViewPlaceHolder) {
        var self = this;

        subWebViewPlaceHolder.setAttribute('data-otm-url', 'extensions/google-place-provider/google-place-details-subwebview/google-place-details.html');
        subWebViewPlaceHolder.setAttribute('data-otm-entrypoint', 'extensions/google-place-provider/google-place-details-subwebview/entryPoint');

        // Wait the SubWebView is loaded before loading the data
        var subWebViewId = subWebViewPlaceHolder.getAttribute('id');
        SubWebView.onCreate(subWebViewId, function() {
            var subWebView = /** @type {SubWebView} */ Widget.findById(subWebViewId);

            function firePlaceDataLoadedEvent(place) {
                subWebView.fireInternalEvent(placeDetailsSubWebViewConstants.PLACE_DATA_LOADED_EVENT, {
                    placeAddress: place.additionalParameters['formatted_address']
                });
            }

            // Load place details if necessary and send it to the subWebView
            if (place.additionalParameters['formatted_address']) {
                firePlaceDataLoadedEvent(place);
            } else {
                self.getPlaceDetails(place, function(updatedPlace) {
                    firePlaceDataLoadedEvent(updatedPlace);
                });
            }
        });
    };

    return GooglePlaceProvider;
});
