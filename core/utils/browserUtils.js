/**
 * Very light compatibility layer to access some browser functionality.
 *
 * @author Marc Plouhinec
 */

'use strict';

define(function () {

    var browserUtils = {
        /**
         * Get the window width and height.
         * @see http://www.javascripter.net/faq/browserw.htm
         *
         * @return {{width: Number, height: Number}}
         */
        'getWindowDimension': function() {
            var windowDimension = {
                width: 640,
                height: 480
            };
            if (document.body && document.body.offsetWidth) {
                windowDimension.width = document.body.offsetWidth;
                windowDimension.height = document.body.offsetHeight;
            }
            if (document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetWidth ) {
                windowDimension.width = document.documentElement.offsetWidth;
                windowDimension.height = document.documentElement.offsetHeight;
            }
            if (window.innerWidth && window.innerHeight) {
                windowDimension.width = window.innerWidth;
                windowDimension.height = window.innerHeight;
            }
            return windowDimension;
        },

        /**
         * Listen to the resize event of the window object.
         *
         * @param {Function} listener
         */
        'onWindowResize': function(listener) {
            var onresize = window.onresize;
            window.onresize = function(event) {
                if (typeof onresize === 'function') {
                    onresize(event);
                }
                listener(event);
            }
        },

        /**
         * Make a GET AJAX request.
         *
         * @param {String} url
         * @param {function(responseText: String)} successListener
         */
        'getText': function(url, successListener) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                    successListener(xhr.responseText);
                }
            };
            xhr.send(null);
        }
    };

    return browserUtils;
});
