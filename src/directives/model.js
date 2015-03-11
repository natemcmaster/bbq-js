var util = require('../util');

module.exports = function(bbq) {

    bbq.directive('model', function() {
        return {
            link: function(element, $scope, attr) {
                var l = function(ev) {
                    var setter = $scope.__lookupSetter__(attr);
                    setter.call($scope, ev.target.value, ev.target);
                };
                element.addEventListener('input', l, false);
                var parent = element.parentNode;
                while (parent && parent.nodeName != "BODY") {
                    if (parent.nodeName == "FORM") {
                        parent.addEventListener('reset', l, false);
                        break;
                    }
                    parent = parent.parentNode;
                }
                util.bindAttribute(element, 'value', $scope, attr);
            }
        };
    });
};
