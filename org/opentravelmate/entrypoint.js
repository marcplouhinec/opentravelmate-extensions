/**
 * Define the main view entry point.
 *
 * @author Marc Plouhinec
 */

define(['./controller/main/mainController'], function(mainController) {
    'use strict';

    /**
     * Extension entry point.
     */
    return function mainEntryPoint() {
        mainController.init();
    };
});
