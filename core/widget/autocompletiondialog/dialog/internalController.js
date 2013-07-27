/**
 * Define the auto-completion dialog internal WebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'underscore',
    'core/widget/Widget',
    'core/widget/webview/webview'
], function($, _, Widget, webview) {
    'use strict';

    var internalController = {

        /**
         * @const
         * @type {String}
         */
        'AUTOCOMPLETION_DIALOG_WEBVIEW_ID': 'autocompletion-dialog-webview',

        /**
         * @const
         * @type {String}
         */
        'AUTOCOMPLETION_DIALOG_SETITEMS_EVENT': 'autocompletion-dialog-setitems-event',

        /**
         * Initialize the dialog WebView.
         */
        'initWebView': function() {
            var self = this;

            // Listen to the external controller events
            webview.onExternalEvent(this.AUTOCOMPLETION_DIALOG_SETITEMS_EVENT, function handleSetItemsEvent(payload) {
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
