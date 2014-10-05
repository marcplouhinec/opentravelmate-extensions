/**
 * Utility functions for manipulating strings.
 *
 * @author Marc Plouhinec
 */

'use strict';

define(['jquery'], function ($) {
    var stringUtils = {
        /**
         * Compute the displayed size of a string.
         * Thanks to: http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
         *
         * @param {String} str
         *   String to measure
         * @param {String=} font
         *   CSS font (e.g. '12px arial')
         * @param {HTMLElement=} container
         *   Container DIV that will contain the text
         */
        'computeWidth': function (str, font, container) {
            var c = !container ? $('body') : $(container),
                f = font || '12px arial',
                o = $('<div>' + str + '</div>')
                    .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
                    .appendTo(c),
                w = o.width();

            o.remove();

            return w;
        },

        /**
         * Remove the whitespaces at the beginning and at the end of the given string.
         *
         * @param {String} str
         *   String to trim.
         * @return {String}
         *   Trimmed string.
         */
        'trim': function (str) {
            if (str.trim) {
                return str.trim();
            }
            if (str.replace) {
                return str.replace(/^\s+|\s+$/g, '');
            }
            return str;
        }
    };

    return stringUtils;
});
