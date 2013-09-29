/**
 * Define an extension manager.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(['underscore', './Extension'], function(_, Extension) {
    'use strict';

    /**
     * Default extensions to be automatically started.
     *
     * @type {Array.<Extension>}
     * @const
     */
    var DEFAULT_EXTENSIONS = [
        new Extension({id: 'map-tools', entryPoint: 'extensions/map-tools/entryPoint'}),
        new Extension({id: 'place-finder', entryPoint: 'extensions/place-finder/entryPoint'}),
        new Extension({id: 'google-place-provider', entryPoint: 'extensions/google-place-provider/entryPoint'})  ,
        new Extension({id: 'services4otm-publictransport', entryPoint: 'extensions/services4otm-publictransport/entryPoint'})
    ];

    var extensionManager = {
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

    return extensionManager;
});
