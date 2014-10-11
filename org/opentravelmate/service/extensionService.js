/**
 * Allow the user to setup extensions for the application.
 *
 * @author Marc Plouhinec
 */

define(['lodash', '../entity/Extension'], function(_, Extension) {
    'use strict';

    /**
     * Default extensions to be automatically started.
     *
     * @type {Array.<Extension>}
     * @const
     */
    var DEFAULT_EXTENSIONS = [
        // new Extension({id: 'com.opentravelmate', entryPoint: 'extensions/com/opentravelmate/entryPoint'})
    ];

    /**
     * Allow the user to setup extensions for the application.
     */
    var extensionService = {
        /**
         * Start the extensions.
         */
        startExtensions: function() {
            // Start the default extensions
            _.each(DEFAULT_EXTENSIONS, function(extension) {
                require([extension.entryPoint], function(entryPoint) {
                    entryPoint();
                });
            });

            // Start the user extensions
            // TODO
        }
    };

    return extensionService;
});
