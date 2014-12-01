var util = require('./util');

function ObservableArray(base) {
    base = base || [];
    this.handlers = {};
    this.push.apply(this, base);
    return this;
}
ObservableArray.prototype = Object.create(Array.prototype);
ObservableArray.prototype.constructor = ObservableArray;

ObservableArray.prototype.on = function(eventName, handler) {
    if (!this.handlers[eventName])
        this.handlers[eventName] = [];
    this.handlers[eventName].push(handler);
};

ObservableArray.prototype.trigger = function(eventName) {
    if (!this.handlers[eventName])
        return;
    for (var i = 0; i < this.handlers[eventName].length; i++) {
        var func = this.handlers[eventName][i];
        if (util.isFunction(func))
            func.apply(this, Array.prototype.slice.call(arguments, 1));
    }
};

ObservableArray.prototype.push = function() {
    var start = this.length;
    Array.prototype.push.apply(this, arguments);
    for (var i = 0; i < arguments.length; i++) {
        this.trigger('push', arguments[i], start + i);
    }
};

module.exports = ObservableArray;
