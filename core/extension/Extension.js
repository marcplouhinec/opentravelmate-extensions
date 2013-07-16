/**
 * Define metadata of an extension.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(function() {
    /**
     * Create an extension metadata.
     *
     * @param {{id: String, entryPoint: String}} options
     * @constructor
     */
    function Extension(options) {
        /**
         * Folder name of the extension.
         *
         * @type {String}
         */
        this.id = options.id;

        /**
         * Path to the extension entry point.
         *
         * @type {String}
         */
        this.entryPoint = options.entryPoint;
    }

    return Extension;
});