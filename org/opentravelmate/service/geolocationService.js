/**
 * Provide geolocation information.
 *
 * @author Marc Plouhinec
 */

define(['../entity/geolocation/Position',
    '../entity/geolocation/PositionError',
    '../entity/geolocation/PositionOptions',
    '../entity/geolocation/Coordinates',
    'nativeGeolocation'
], function(Position, PositionError, PositionOptions, Coordinates, nativeGeolocation) {
    'use strict';

    /**
     * @type {number}
     */
    var nextCallbacksId = 42;

    /**
     * @type {Object.<string, number>}
     */
    var watchIdByCallbacksId = {};

    /**
     * @type {Object.<string, {successCallback: function(position: Position), errorCallback: function(positionError: PositionError)}>}
     */
    var currentPositionCallbacksById = {};

    /**
     * @type {Object.<string, {successCallback: function(position: Position), errorCallback: function(positionError: PositionError)}>}
     */
    var watchPositionCallbacksById = {};

    /**
     * @type {Object.<string, PositionOptions>}
     */
    var positionOptionsByCallbacksId = {};

    /**
     * @type {Object.<string, Position>}
     */
    var currentBestPositionByCallbacksId = {};

    /**
     * Provide geolocation information.
     */
    var geolocationService = {

        /**
         * Get the current device position.
         *
         * @param {function(position: Position)} successCallback
         * @param {function(positionError: PositionError)} errorCallback
         * @param {PositionOptions} options=
         */
        'getCurrentPosition': function(successCallback, errorCallback, options) {
            var callbacksId = 'callbacks-' + nextCallbacksId++;
            currentPositionCallbacksById[callbacksId] = {
                successCallback: successCallback,
                errorCallback: errorCallback
            };
            nativeGeolocation.getCurrentPosition(callbacksId, JSON.stringify(options || new PositionOptions({})));
        },

        /**
         * Call the success or error currentPosition callback.
         *
         * @param {string} callbacksId
         * @param {Object} positionOptions
         * @param {Object} positionErrorOptions
         * @private
         */
        '_fireCurrentPositionEvent': function(callbacksId, positionOptions, positionErrorOptions) {
            var callbacks = currentPositionCallbacksById[callbacksId];
            if (!callbacks) {
                return;
            }
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
         * @return {number} watchId
         */
        'watchPosition': function(successCallback, errorCallback, options) {
            var self = this;
            var watchId = nextCallbacksId++;
            var callbacksId = 'callbacks-' + watchId;
            watchIdByCallbacksId[callbacksId] = watchId;
            watchPositionCallbacksById[callbacksId] = {
                successCallback: successCallback,
                errorCallback: errorCallback
            };
            positionOptionsByCallbacksId[callbacksId] = options;

            nativeGeolocation.watchPosition(callbacksId, JSON.stringify(options || new PositionOptions({})));

            // Stop watching after the maximum watching time
            if (options.maxWatchTime > 0) {
                setTimeout(function stopWatching() {
                    // Check if the watching has not been cleared already
                    if (watchIdByCallbacksId[callbacksId]) {
                        self.clearWatch(watchId);
                    }
                }, options.maxWatchTime);
            }

            return watchId;
        },

        /**
         * Call the success or error watchPosition callback.
         *
         * @param {string} callbacksId
         * @param {Object} positionOptions
         * @param {Object} positionErrorOptions
         * @private
         */
        '_fireWatchPositionEvent': function(callbacksId, positionOptions, positionErrorOptions) {
            var callbacks = watchPositionCallbacksById[callbacksId];
            if (!callbacks) {
                return;
            }

            if (positionErrorOptions) {
                callbacks.errorCallback(new PositionError(positionErrorOptions));
            } else {
                var position = new Position({
                    coords: new Coordinates(positionOptions.coords),
                    timestamp: positionOptions.timestamp
                });

                var currentBestPosition = currentBestPositionByCallbacksId[callbacksId];
                var options = positionOptionsByCallbacksId[callbacksId];
                if (!options) { return; }

                if (!currentBestPosition || this._isBetterPosition(position, currentBestPosition, options)) {
                    currentBestPositionByCallbacksId[callbacksId] = position;
                    callbacks.successCallback(position);

                    // Stop watching if the accuracy is acceptable
                    var watchId = watchIdByCallbacksId[callbacksId];
                    if (watchId && options.acceptableAccuracy > 0 && position.coords.accuracy <= options.acceptableAccuracy) {
                        this.clearWatch(watchId);
                    }
                }
            }
        },

        /**
         * Stop watching the device position.
         *
         * @param {number} watchId ID provided by the {@link #watchPosition} function.
         */
        'clearWatch': function(watchId) {
            var callbacksId = 'callbacks-' + watchId;
            delete watchIdByCallbacksId[callbacksId];
            delete watchPositionCallbacksById[callbacksId];
            delete currentBestPositionByCallbacksId[callbacksId];
            delete positionOptionsByCallbacksId[callbacksId];

            nativeGeolocation.clearWatch(callbacksId);
        },

        /**
         * Thanks to the Google Android developer page:
         * @see http://developer.android.com/guide/topics/location/strategies.html
         *
         * @param {Position=} newPosition
         * @param {Position=} currentBestPosition
         * @param {PositionOptions} options
         * @returns {boolean} true if the newPosition is better than the current one, or false if not.
         * @private
         */
        '_isBetterPosition': function(newPosition, currentBestPosition, options) {
            if (!currentBestPosition) {
                return true;
            }
            if (!newPosition) {
                return false;
            }

            // Check whether the new position is newer or older
            var timeDelta = newPosition.timestamp - currentBestPosition.timestamp;
            var isSignificantlyNewer = timeDelta > options.maximumAge;
            var isSignificantlyOlder = timeDelta < -options.maximumAge;
            var isNewer = timeDelta > 0;

            if (isSignificantlyNewer) {
                return true;
            } else if (isSignificantlyOlder) {
                return false;
            }

            // Check whether the new position is more or less accurate
            var accuracyDelta = newPosition.coords.accuracy - currentBestPosition.coords.accuracy;
            var isMoreAccurate = accuracyDelta < 0;
            var isSignificantlyLessAccurate = !options.acceptableAccuracy ? false : accuracyDelta > 2 * options.acceptableAccuracy;

            if (isMoreAccurate) {
                return true;
            } else if (isNewer && !isSignificantlyLessAccurate) {
                return true;
            }

            return false;
        }
    };

    return geolocationService;
});
