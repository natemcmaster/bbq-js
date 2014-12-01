var util = require('./util');

function scope(parent) {
    if (!!parent)
        this.__parent = parent;
}

scope.prototype.lookup = function(key) {
    if (this[key])
        return this[key];
    else if (this.__parent && util.isFunction(this.__parent.lookup))
        return this.__parent.lookup(key);
    return undefined;
};

scope.prototype.set = function(key, value) {
    if (this[key])
        this[key] = value;
    else if (this.__parent && util.isFunction(this.__parent.set))
        this.__parent.set(key, value);
};


module.exports = scope;
