/**
 * Provide transport route information.
 *
 * @author Marc Plouhinec
 */

define([
    'jquery',
    'lodash',
    '../entity/Timetable',
    '../entity/WSError'
], function($, _, Timetable, WSError) {
    'use strict';

    /**
     * Provide transport route information.
     */
    var routeService = {

        /**
         * Find the timetables for the given route.
         *
         * @param {String} routeId
         * @param {function(error: WSError|undefined, timetables: Array.<Timetable>)} callback
         */
        'findTimetablesByRouteId' : function(routeId, callback) {
            var url = 'http://www.opentravelmate.io/route/' + this._encodeId(routeId) + '/timetables?callback=?';
            $.getJSON(url).done(function(result) {
                if (result.errorMessage) {
                    return callback(new WSError(result.httpStatus, result.errorMessage), []);
                }

                var timetables = _.map(result, function(timetable) {
                    return new Timetable(timetable);
                });

                callback(undefined, timetables);
            });
        },

        /**
         * Encode an ID in order to make it URI-compatible.
         *
         * @private
         * @param {string} id
         * @return {string} encoded ID
         */
        '_encodeId': function(id) {
            var encodedId = encodeURIComponent(String(id));
            if (encodedId.indexOf('%2F')) {
                encodedId = encodedId.replace('%2F', '%252F');
            }
            return encodedId;
        }

    };

    return routeService;
});
