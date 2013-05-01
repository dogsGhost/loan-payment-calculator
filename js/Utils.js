/**
* @fileOverview Makes event actions consistent across browsers, mostly IE7.
* @author Original author unknown
* @author Scott Shaper - refactoring
* @author David Wilhelm - refactoriing
*/

var Utils = {};

if (document.addEventListener) {
    Utils.preventDefault = function (e) {
        e.preventDefault();
    };

    Utils.stopPropagation = function (e) {
        e.stopPropagation();
    };

    Utils.addEventListener = function (target, type, listener) {
        target.addEventListener(type, listener, false);
    };

    Utils.removeEventListener = function (target, type, listener) {
        target.removeEventListener(type, listener, false);
    };
} else if (document.attachEvent) {
    Utils._listenerCounter = 0;

    Utils.preventDefault = function (e) {
        e.returnValue = false;
    };

    Utils.stopPropagation = function (e) {
        e.cancelBubble = true;
    };

    Utils.addEventListener = function (target, type, listener) {
        // Prevent adding the same listener twice, since DOM 2 Events
        // ignore duplicates.
        if (Utils._findListener(target, type, listener) !== -1) {
            return;
        }

        // Call listener depending on what this version of IE supports, and
        // passes it the global event object as an argument.
        var listener2 = function () {
            var event = window.event;

            if (Function.prototype.call) {
                listener.call(target, event);
            } else {
                target._currentListener = listener;
                target._currentListener(event);
                target._currentListener = null;
            }
        };

        // Add listener2 using IE's attachEvent method.
        target.attachEvent("on" + type, listener2);

        // The above code allows us to create an event listener for IE
        // and be able to use the "this" keyword. The code below
        // stores our object references so the can be cleaned up later.
        // This stops any memory leak issues.

        // Create an object describing this listener so we can clean it up later.
        var listenerRecord = {
            target: target,
            type: type,
            listener: listener,
            listener2: listener2
        };

        // Get a reference to the window object containing target.
        var targetDocument = target.document || target;
        var targetWindow = targetDocument.parentWindow;

        // Create a unique ID for this listener.
        var listenerId = "l" + Utils._listenerCounter++;

        // Store a record of this listener in the window object.
        if (!targetWindow._allListeners) {
            targetWindow._allListeners = {};
        }
        targetWindow._allListeners[listenerId] = listenerRecord;

        // Store this listener's ID in target.
        if (!target._listeners) {
            target._listeners = [];
        }
        target._listeners[target._listeners.length] = listenerId;

        // Set up Utils._removeAllListeners to clean up all listeners on unload.
        if (!targetWindow._unloadListenerAdded) {
            targetWindow._unloadListenerAdded = true;
            targetWindow.attachEvent("onunload", Utils._removeAllListeners);
        }
    };

    Utils.removeEventListener = function (target, type, listener) {
        // Find out if the listener was actually added to target.
        var listenerIndex = Utils._findListener(target, type, listener);
        if (listenerIndex === -1) {
            return;
        }

        // Get a reference to the window object containing target.
        var targetDocument = target.document || target;
        var targetWindow = targetDocument.parentWindow;

        // Obtain the record of the listener from the window object.
        var listenerId = target._listeners[listenerIndex];
        var listenerRecord = targetWindow._allListeners[listenerId];

        // Remove the listener, and remove its ID from target.
        target.detachEvent("on" + type, listenerRecord.listener2);
        target._listeners.splice(listenerIndex, 1);

        // Remove the record of the listener from the window object.
        delete targetWindow._allListeners[listenerId];
    };

    Utils._findListener = function (target, type, listener) {
        // Get the array of listener IDs added to target.
        var listeners = target._listeners;
        if (!listeners) {
            return -1;
        }

        // Get a reference to the window object containing target.
        var targetDocument = target.document || target;
        var targetWindow = targetDocument.parentWindow;

        // Searching backward (to speed up on unload processing), find
        // the listener.
        var i = listeners.length;
        while (i--) {
            // Get the listener's ID from target.
            var listenerId = listeners[i];

            // Get the record of the listener from the window object.
            var listenerRecord = targetWindow._allListeners[listenerId];

            // Compare type and listener with the retrieved record.
            if (listenerRecord.type === type &&
                listenerRecord.listener === listener) {
                return i;
            }
        }
        return -1;
    };

    Utils._removeAllListeners = function () {
        var id, targetWindow = this;

        // Loop through object and remove listeners.
        for (id in targetWindow._allListeners) {
            var listenerRecord = targetWindow._allListeners[id];
            listenerRecord
                .target
                .detachEvent("on" + listenerRecord.type, listenerRecord.listener2);
            delete targetWindow._allListeners[id];
        }
    };
}