var Scope = require('../scope'),
    util = require('../util'),
    ObservableArray = require('../array');


function bfs(element, $scope) {
    this.processor(element, $scope);
    for (var i = 0; i < element.childNodes.length; i++)
        bfs.call(this, element.childNodes[i], $scope);
}

function createSubScope(template, parentObj, key, itemKey) {
    var $itemScope = new Scope(parentObj);
    $itemScope[itemKey] = parentObj[key];

    util.addWatcher(parentObj, key, function() {
        var setter = Object.getOwnPropertyDescriptor($itemScope, itemKey).set;
        setter.apply($itemScope, arguments);
    });
    var newItem = template.cloneNode(true);
    newItem.removeAttribute('bbq-repeat');
    bfs.call(this, newItem, $itemScope);
    return newItem;
}

module.exports = function(bbq) {
    bbq.directive('repeat', function() {
        return {
            link: function(element, $scope, attr) {
                var keys = attr.split(' in ');
                if (keys.length != 2)
                    throw new Error('Invalid bbq-repeat syntax');
                var itemKey = keys[0],
                    groupKey = keys[1];

                if (!util.isArray($scope.lookup(groupKey)))
                    throw new Error('Cannot use non-array items with repeat (yet)');

                var anchor=document.createComment('End bbq-repeat');
                var template=element.cloneNode(true);
                element.parentNode.insertBefore(anchor,element);
                element.parentNode.removeChild(element);
                delete element;

                var collection = new ObservableArray($scope[groupKey]);

                for (var i = 0; i < collection.length; i++) {
                    var item=createSubScope.call(this, template, collection, i, itemKey);
                    anchor.parentNode.insertBefore(item, anchor);
                }

                collection.on('push',function(val,index){
                    var item=createSubScope.call(this, template, collection, index, itemKey);
                    anchor.parentNode.insertBefore(item, anchor);
                }.bind(this));

                $scope[groupKey] = collection;

            }
        };
    });
};
