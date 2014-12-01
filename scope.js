var util = require('./util');

function Scope(parent) {
    if (!!parent)
        this.__parent = parent;
}

Scope.prototype.lookup = function(key) {
    if (this[key])
        return this[key];
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


module.exports = Scope;
