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
    var keyExists = typeof this.lookup(key) !== 'undefined';
    var keyParts = (key.split) ? key.split('.') : [key];
    var obj = this;
    var propName=keyParts[0];
    for (var i = 0; i < keyParts.length -1; i++) {
        if (!obj[keyParts[i]]) {
            if(keyExists)
                break;
            obj[keyParts[i]]={};
        }
        obj = obj[keyParts[i]];
        propName = keyParts[i+1];
    }
    if(obj && (keyExists ? obj[propName] : true)){
        obj[propName]=value;
        return;
    }
    else if (this.__parent && util.isFunction(this.__parent.set))
        this.__parent.set(key, value);
    else
        throw new Error('Could not set value on scope');
};

Scope.prototype.$watch = function(key,update){
    return util.addWatcher(this,key,update);
};

module.exports = Scope;
