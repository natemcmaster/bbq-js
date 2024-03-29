var util = {};

util.parseEventCall = function(str,specials) {
    if (!str || !str.match)
        return null;
    var match = str.match(/^(\w+)\(([^)]*)\)/);
    if (!match)
        return null;
    var obj = {};
    obj.name = match[1];
    if(match.length < 3)
        obj.args=[];
    else
        obj.args = match[2].split(',').filter(function(s){
            return s.trim().length;
        }).map(function(arg){
            arg = arg.trim();
            var matches = arg.match(/^'([\w\s]+)'|"([\w\s]+)"|(-?\d+)|true|false$/); // strings and numbers and bool
            if(matches) {
                return {
                    type: 'constant',
                    value: eval(arg) // a very careful and deliberate use
                };
            }
            else if(util.isFunction(specials)) {
                var match = specials(arg);
                if(match)
                    return match;
            }
            return {
                type: 'variable',
                value: arg
            };
        });
    return obj;
};

util.isFunction = function(obj) {
    return !!obj && typeof obj === 'function';
};

util.isArray = function(obj) {
    return !!obj && obj instanceof Array;
};

util.isDefined = function(obj){
    return typeof obj !== 'undefined';
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
        $scope.set(key,'');
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


    var obj=$scope;
    var keyParts = (key.split) ? key.split('.') : [key];
    var propName=keyParts[0];
    for (var i = 0; i < keyParts.length -1; i++) {
        if (!obj[keyParts[i]])
            break;
        obj = obj[keyParts[i]];
        propName=keyParts[i+1];
    }
    var descriptor = Object.getOwnPropertyDescriptor(obj, propName);
    if (descriptor && !descriptor.configurable) {
        return;
    }

    Object.defineProperty(obj, propName, {
        enumerable: true,
        configurable: false,
        set: function(val, trigger) {
            for (var x in $scope.__watchers[key])
                $scope.__watchers[key][x].call($scope, val, trigger);
            $scope.__values[key] = val;
        },
        get: function() {
            return $scope.__values[key];
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
