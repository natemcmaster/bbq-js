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

ObservableArray.prototype.splice = function(start,howMany){
    var originalLength=this.length;
    var ret=[];
    howMany = howMany || this.length;
    for(var i = 0; i < howMany; i++){
        ret.push(this[start+i]);
        delete this[start+i];
        this.length--;
    }
    for(var j = start+howMany, i=0; j < originalLength; j++, i++){
        this[start+i] = this[j];
        delete this[j];
    }

    this.trigger('splice',arguments[0], howMany);
    return ret;
};

module.exports = ObservableArray;
