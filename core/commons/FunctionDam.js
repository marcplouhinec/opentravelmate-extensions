/**
 * Define a class that execute functions when a gate is opened, and accumulate them when the gate is closed.
 *
 * @author marc.plouhinec@gmail.com (Marc Plouhinec)
 */

define([], function() {
    'use strict';

    /**
     * Create a FunctionDam.
     *
     * @constructor
     */
    function FunctionDam() {
        /**
         * @type {boolean}
         * @private
         */
        this._isOpened = false;

        /**
         * @type {Array.<Function>}
         * @private
         */
        this._functionsToExecuteWhenOpened = [];
    }

    /**
     * Execute the given function when the gate is opened.
     * If the gate is closed, save the function until the gate open again.
     *
     * @param {Function} functionToExecute
     */
    FunctionDam.prototype.executeWhenOpen = function(functionToExecute) {
        if (this._isOpened) {
            functionToExecute();
        } else {
            this._functionsToExecuteWhenOpened.push(functionToExecute);
        }
    };

    /**
     * Open or close the gate.
     * Note: execute all the saved functions when the gate opens.
     *
     * @param {Boolean} opened
     */
    FunctionDam.prototype.setOpened = function(opened) {
        this._isOpened = opened;

        if (opened) {
            for (var i = 0; i < this._functionsToExecuteWhenOpened.length; i+= 1) {
                this._functionsToExecuteWhenOpened[i]();
            }
        }
    };

    /**
     * @return {Boolean} true if the gate is opned, false if not.
     */
    FunctionDam.prototype.isOpened = function() {
        return this._isOpened;
    };

    return FunctionDam;
});
