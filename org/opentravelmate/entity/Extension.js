/**
 * Define metadata of an extension.
 *
 * @author Marc Plouhinec
 */

define(function() {
    /**
     * Create an extension metadata.
     *
     * @param {{id: string, entryPoint: string}} options
     * @constructor
     */
    function Extension(options) {
        /**
         * Folder name of the extension.
         *
         * @type {string}
         */
        this.id = options.id;

        /**
         * Path to the extension entry point.
         *
         * @type {string}
         */
        this.entryPoint = options.entryPoint;
    }

    return Extension;
});