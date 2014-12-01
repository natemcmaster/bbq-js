module.exports = function(bbq) {
    bbq.directive('repeat', function() {
        return {
            link: function(element, scope, attr) {
                var keys = attr.split(' in ');
                if (keys.length != 2)
                    throw new Error('Invalid bbq-repeat syntax');
                var itemKey = keys[0],
                    groupKey = keys[1];
                var bfs = function(element, scope) {
                    this.processor(element, scope);
                    for (var i = 0; i < element.childNodes.length; i++)
                        bfs.call(this, element.childNodes[i], scope);
                };
                for (var i = scope[groupKey].length - 1; i >= 0; i--) {
                    //TODO check conflict
                    scope[itemKey] = scope[groupKey][i];
                    var newItem = element.cloneNode(true);
                    newItem.removeAttribute('bbq-repeat');
                    bfs.call(this, newItem, scope);
                    element.parentNode.insertBefore(newItem, element);
                }
                element.parentNode.removeChild(element);
            }
        };
    });
};
