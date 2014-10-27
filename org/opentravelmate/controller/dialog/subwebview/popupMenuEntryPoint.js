/**
 * Popup menu dialog box web view entry point.
 *
 * @author Marc Plouhinec
 */

define(['../../widget/webview/webview', '../popupMenuEvent'], function(webview, popupMenuEvent) {
    'use strict';

    /**
     * Sub web view entry point.
     */
    return function main() {
        var title = /** @type {String} */ webview.additionalParameters['title'];
        var iconUrl = /** @type {String} */ webview.additionalParameters['iconurl'];
        var jsonMenuItems = /** @type {String} */ webview.additionalParameters['menuitems'];
        var menuItems = /** @type {Array} */JSON.parse(jsonMenuItems);

        // Display the header
        var titleIconElement = document.getElementById('title-icon');
        titleIconElement.setAttribute('src', webview.baseUrl + iconUrl);
        titleIconElement.style.display = 'block';
        document.getElementById('title-label').textContent = title;

        // Display the menu items
        var menuItemTemplate = document.getElementById('tpl-menu-item').textContent;
        var menuItemsHtml = '';
        for (var i = 0; i < menuItems.length; i++) {
            var menuItem = menuItems[i];
            var menuItemHtml = menuItemTemplate.replace('${id}', menuItem.id);
            menuItemHtml = menuItemHtml.replace('${title}', menuItem.title);
            menuItemHtml = menuItemHtml.replace('${iconUrl}', webview.baseUrl + menuItem.iconUrl);
            menuItemsHtml += menuItemHtml;
        }
        var contentElement = /** @type {HTMLDivElement} */document.getElementById('content');
        contentElement.innerHTML = menuItemsHtml;

        // Handle the click events
        function addEventListener(elementId, menuEvent, menuItemId) {
            var handleCloseEvent = function() { webview.fireExternalEvent(menuEvent, { menuItemId: menuItemId }); };
            var element = document.getElementById(elementId);
            element.addEventListener('click', handleCloseEvent, false);
            element.addEventListener('touchstart', handleCloseEvent, false);
        }
        addEventListener('close-button', popupMenuEvent.MENU_CLOSED, null);
        for (var j = 0; j < menuItems.length; j++) {
            addEventListener(menuItems[j].id, popupMenuEvent.ITEM_SELECTED, menuItems[j].id);
        }
    };
});