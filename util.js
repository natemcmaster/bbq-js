var util = {};

util.parseEventCall = function(str) {
    if (!str || !str.match)
        return null;
    var match = str.match(/^(\w+)\(\)/);
    if (!match)
        return null;
    var obj = {};
    obj.name = match[1];
    return obj;
};

util.isFunction = function(obj) {
    return !!obj && typeof obj === 'function';
};

util.isArray = function(obj) {
    return !!obj && obj instanceof Array;
};

/**
 * Creates a get-set trigger on element for $scope,key.
 * If attr is set, this is the attribute to change on the element
 * @param  {Node} element DOM element
 * @param  {Scope} $scope  The scope to bind to
 * @param  {string} key     The item on the $scope to lookup
 * @param  {function} onUpdate    Action to be called on update
 * @return {void}
 */
util.addWatcher = function($scope, key, update) {
    if (util.isFunction($scope.lookup) && !$scope.lookup(key)) {
        $scope[key] = '';
    }
    if (typeof $scope.__values === 'undefined') {
        $scope.__values = {};
    }
    if (typeof $scope.__watchers === 'undefined') {
        $scope.__watchers = {};
    }
    if (!$scope.__values[key]) {
        $scope.__values[key] = util.isFunction($scope.lookup) ? $scope.lookup(key) : $scope[key]; //TODO deep copy
    }
    $scope.__watchers[key] = $scope.__watchers[key] || [];
    $scope.__watchers[key].push(update);

    var descriptor = Object.getOwnPropertyDescriptor($scope, key);
    if (descriptor && !descriptor.configurable) {
        return;
    }

    Object.defineProperty($scope, key, {
        enumerable: true,
        configurable: false,
        set: function(val, trigger) {
            for (var x in this.__watchers[key])
                this.__watchers[key][x].call(this, val, trigger);
            this.__values[key] = val;
        },
        get: function() {
            return this.__values[key];
        }
    });
};

util.bindAttribute = function(element, attribute, $scope, key) {
    util.setAttribute(element, attribute, $scope.lookup(key));
    util.addWatcher($scope, key, function(val, trigger) {
        util.setAttribute(element, attribute, val, trigger);
    });
};

util.setAttribute = function(element, attr, value, trigger) {
    if (!attr)
        throw new Error('attr undefined');
    if (element === trigger) {
        return;
    }
    element[attr] = value || '' ;
};

module.exports = util;
