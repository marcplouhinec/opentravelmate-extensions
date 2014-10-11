/**
 * Options for displaying a dialog box.
 *
 * @author Marc Plouhinec
 */

define(function() {
    'use strict';

    /**
     * Create new DialogOptions.
     *
     * @param {{
     *     maxWidth: =number,
     *     height: =number
     * }} options
     * @constructor
     */
    function DialogOptions(options) {

        /**
         * Maximum dialog box width in pixels.
         *
         * @type {number}
         */
        this.maxWidth = options.maxWidth || 350;

        /**
         * Dialog bow height in pixels.
         *
         * @type {number}
         */
        this.height = options.height || 180;
    }

    return DialogOptions;
});
