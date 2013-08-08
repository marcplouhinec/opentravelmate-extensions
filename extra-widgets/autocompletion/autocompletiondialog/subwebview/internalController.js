/**
 * Define the auto-completion dialog internal WebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'underscore',
    'core/widget/Widget',
    'core/widget/webview/webview',
    './constants'
], function($, _, Widget, webview, constants) {
    'use strict';

    var internalController = {
        /**
         * Initialize the subwebview WebView.
         */
        'initWebView': function() {
            var self = this;

            document.body.style.overflow = 'auto';

            // Listen to the external controller events
            webview.onExternalEvent(constants.AUTOCOMPLETION_DIALOG_SETITEMS_EVENT, function handleSetItemsEvent(payload) {
                self.setItems(payload.items);
            });
        },

        /**
         * Set the rendered items to show.
         *
         * @param {Array.<String>} items
         */
        'setItems': function(items) {
            $('#items').empty();
            _.each(items, function(item) {
                $('#items').append('<tr><td class="item">' + item + '</td></tr>');
            });
        }
    };

    return internalController;
});
