/**
 * Handle the menu that is displayed when a place is selected.
 *
 * @author Marc Plouhinec
 */

define([
    '../../entity/Place',
    '../dialog/PopupMenuItem',
    '../dialog/DialogOptions',
    '../dialog/popupMenuController',
    './placeDetailsController',
    '../itinerary/itineraryFinderController'
], function(Place, PopupMenuItem, DialogOptions, popupMenuController, placeDetailsController, itineraryFinderController) {

    /**
     * @const
     * @type {Array.<PopupMenuItem>}
     */
    var MENU_ITEMS = [
        new PopupMenuItem({ id: 'GO_THERE', title: 'Go to this place', iconUrl: 'extensions/org/opentravelmate/view/place/image/ic_go_there_light.png' }),
        new PopupMenuItem({ id: 'FROM_THERE', title: 'Start from this place', iconUrl: 'extensions/org/opentravelmate/view/place/image/ic_from_there_light.png' }),
        new PopupMenuItem({ id: 'MORE_INFORMATION', title: 'More Information', iconUrl: 'extensions/org/opentravelmate/view/place/image/ic_more_info_light.png' })
    ];

    /**
     * @const
     * @type {string}
     */
    var MENU_ICON = 'extensions/org/opentravelmate/view/place/image/ic_more_info_light.png';

    /**
     * Handle the menu that is displayed when a place is selected.
     */
    var placeSelectionMenuController = {

        /**
         * Show the menu for the given place.
         *
         * @param {Place} place
         */
        'showMenu': function(place) {
            popupMenuController.showMenu(place.name, MENU_ICON, MENU_ITEMS, new DialogOptions({height: 215}), function handleItemSelection(menuItemId) {
                if (!menuItemId) { return; }

                switch (menuItemId) {
                    case 'GO_THERE':
                        itineraryFinderController.openItineraryFinder(null, place);
                        break;
                    case 'FROM_THERE':
                        itineraryFinderController.openItineraryFinder(place, null);
                        break;
                    case 'MORE_INFORMATION':
                        placeDetailsController.showPlaceDetails(place);
                        break;
                }
            });
        }

    };

    return placeSelectionMenuController;
});