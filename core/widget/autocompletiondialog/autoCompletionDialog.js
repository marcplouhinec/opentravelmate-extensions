/**
 * Define an auto-completion dialog box.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define(['./dialog/externalController'], function(externalController) {
    'use strict';

    var autoCompletionDialog = {
        /**
         * Set layout information.
         *
         * @param {{x: number, y: number}} anchor
         * @param {number} width
         */
        'setLayoutParams': function(anchor, width) {
            externalController.setLayoutParams(anchor, width);
        },

        /**
         * Show or hide the auto completion dialog.
         *
         * @param {boolean} visible
         */
        'setVisible': function(visible) {
            if (visible) {
                externalController.showWebView();
            } else {
                externalController.removeWebView();
            }
        },

        /**
         * @return {boolean} true if the dialog is visible, false if not.
         */
        'isVisible': function() {
            return externalController.isVisible();
        },

        /**
         * Set the item renderer.
         *
         * @param {function(item: Object): String} itemRenderer
         */
        'setItemRenderer': function(itemRenderer) {
            externalController.setItemRenderer(itemRenderer);
        },

        /**
         * Set the items to show.
         *
         * @param {Array.<Object>} items
         */
        'setItems': function(items) {
            externalController.setItems(items);
        },

        /**
         * Register a listener when an item is selected.
         *
         * @param {function(place: Object)} listener
         */
        'onSelect': function(listener) {
            // TODO
        }
    };

    return autoCompletionDialog;
});
