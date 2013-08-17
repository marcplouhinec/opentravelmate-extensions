/**
 * Define the auto-completion dialog internal WebView controller.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([
    'jquery',
    'underscore',
    '../../../../core/widget/Widget',
    '../../../../core/widget/webview/webview',
    './constants',
    'jqueryGoogleFastButton'
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
                self._setItems(payload.items);
            });
        },

        /**
         * Set the rendered items to show.
         *
         * @param {Array.<String>} items
         * @private
         */
        '_setItems': function(items) {
            var self = this;

            $('#items').empty();
            _.each(items, function(item, index) {
                $('#items').append('<tr><td class="item" id="item_' + index + '">' + item + '</td></tr>');
            });

            // Listen to the item click events
            $('.item').fastClick(function handleItemClick(event) {
                var itemIndex = Number($(event.target).attr('id').substr('item_'.length));
                self._selectItem(itemIndex);
            });
        },

        /**
         * Select the given item.
         *
         * @param {Number} itemIndex
         *     Index of the selected item.
         * @private
         */
        '_selectItem': function(itemIndex) {
            webview.fireExternalEvent(constants.AUTOCOMPLETION_DIALOG_SELECTITEM_EVENT, {
                itemIndex: itemIndex
            });
        }
    };

    return internalController;
});
