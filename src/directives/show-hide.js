function show(element) {
    if (element.style.removeProperty)
        element.style.removeProperty('display');
    else
        element.style.display = '';
}

function hide(element) {
    element.style.display = 'none';
}

module.exports = function(bbq) {
    bbq.directive('show', function() {
        return {
            link: function(element, $scope, attr) {
                var up = function(val) {
                    if (!!val)
                        show(element);
                    else
                        hide(element);
                };
                up($scope.lookup(attr));
                $scope.$watch(attr, up);
            }
        };
    });
    bbq.directive('hide', function() {
        return {
            link: function(element, $scope, attr) {
                var down = function(val) {
                    if (!!val)
                        hide(element);
                    else
                        show(element);
                };
                down($scope.lookup(attr));
                $scope.$watch(attr, down);
            }
        };
    });
};
