var util = require('./util');

function Scope(parent) {
    if (!!parent)
        this.__parent = parent;
}

Scope.prototype.lookup = function(key) {
    var keyParts = (key.split) ? key.split('.') : [key];
    var obj = this;
    for (var i = 0; i < keyParts.length; i++) {
        obj = obj[keyParts[i]];
        if (!obj)
            break;
    }
    if (!!obj)
        return obj;
    else if (this.__parent && util.isFunction(this.__parent.lookup))
        return this.__parent.lookup(key);
    return undefined;
};

Scope.prototype.set = function(key, value) {
    if (this[key])
        this[key] = value;
    else if (this.__parent && util.isFunction(this.__parent.set))
        this.__parent.set(key, value);
};

Scope.prototype.$watch = function(key,update){
    return util.addWatcher(this,key,update);
};

module.exports = Scope;
