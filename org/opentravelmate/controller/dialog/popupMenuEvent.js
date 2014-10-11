/**
 * Events thrown by the popup menu sub-webview.
 *
 * @author Marc Plouhinec
 */

define(function() {

    /**
     * Events thrown by the popup menu sub-webview.
     *
     * @readonly
     * @enum {string}
     */
    var popupMenuEvent = {
        MENU_CLOSED: 'popup-menu-closed-event',
        ITEM_SELECTED: 'popup-menu-item-selected-event'
    };

    return popupMenuEvent;
});