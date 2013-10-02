/**
 * Provide geolocation information.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    './Position',
    './PositionError',
    './Coordinates',
    'nativeGeolocation'
], function(Position, PositionError, Coordinates, nativeGeolocation) {
    'use strict';

    /**
     * @type {number}
     */
    var nextCallbacksId = 0;

    /**
     * @type {Object.<String, {successCallback: function(position: Position), errorCallback: function(positionError: PositionError)}>}
     */
    var currentPositionCallbacksById = {};

    var geolocation = {
        /**
         * Get the current device position.
         *
         * @param {function(position: Position)} successCallback
         * @param {function(positionError: PositionError)} errorCallback
         * @param {PositionOptions} options
         */
        'getCurrentPosition': function(successCallback, errorCallback, options) {
            var callbacksId = 'callbacks-' + nextCallbacksId++;
            currentPositionCallbacksById[callbacksId] = {
                successCallback: successCallback,
                errorCallback: errorCallback
            };
            nativeGeolocation.getCurrentPosition(callbacksId, JSON.stringify(options));
        },

        /**
         * Call the success or error currentPosition callback.
         *
         * @param {String} callbacksId
         * @param {Object} positionOptions
         * @param {Object} positionErrorOptions
         */
        'fireCurrentPositionEvent': function(callbacksId, positionOptions, positionErrorOptions) {
            var callbacks = currentPositionCallbacksById[callbacksId];
            delete currentPositionCallbacksById[callbacksId];

            if (positionErrorOptions) {
                callbacks.errorCallback(new PositionError(positionErrorOptions));
            } else {
                var position = new Position({
                    coords: new Coordinates(positionOptions.coords),
                    timestamp: positionOptions.timestamp
                });
                callbacks.successCallback(position);
            }
        },

        /**
         * Follow the device position.
         *
         * @param {function(position: Position)} successCallback
         * @param {function(positionError: PositionError)} errorCallback
         * @param {PositionOptions} options
         * @return {Number} watchId
         */
        'watchPosition': function(successCallback, errorCallback, options) {
            // TODO
            return -1;
        },

        /**
         * Stop watching the device position.
         *
         * @param {Number} watchId ID provided by the {@link #watchPosition} function.
         */
        'clearWatch': function(watchId) {
            // TODO
        }
    };

    return geolocation;
});
