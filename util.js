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
util.createBinding = function(element, key, $scope, attr) {
    if (!$scope[key]) {
        $scope[key] = '';
    }
    if (typeof $scope.__values === 'undefined') {
        $scope.__values = {};
    }
    if (typeof $scope.__setters === 'undefined') {
        $scope.__setters = {};
    }
    if (!$scope.__values[key]) {
        $scope.__values[key] = $scope[key]; //TODO deep copy
    }
    $scope.__setters[key] = $scope.__setters[key] || [];

    util.setAttribute(element, $scope[key], attr);
    $scope.__setters[key].push(function(val, trigger) {
        util.setAttribute(element, val, attr, trigger);
    });

    Object.defineProperty($scope, key, {
        set: function(val, trigger) {
            for (var x in this.__setters[key])
                this.__setters[key][x].call(this, val, trigger);
            this.__values[key] = val;
        },
        get: function() {
            return this.__values[key];
        }
    });

};

util.setAttribute = function(element, value, attr, trigger) {
    if (!attr)
        throw new Error('attr undefined');
    if (element === trigger) {
        return;
    }
    if (attr == 'textContent' && !value)
        value = '';
    element[attr] = value;
};

module.exports = util;
