module.exports = function(bbq) {
    bbq.directive('disabled', function() {
        return {
            link: function(element, $scope, attr) {
                var inverted= false;
                if(attr.substr) {
                    inverted = attr.substr(0,1)==='!';
                    if(inverted)
                        attr = attr.substr(1);
                }
                var disable = function(val) {
                    val = inverted ? !val : !!val;
                    if (val)
                        element.setAttribute('disabled', 'disabled');
                    else
                        element.removeAttribute('disabled');
                };
                disable($scope.lookup(attr));
                $scope.$watch(attr, disable);
            }
        };
    });
};
