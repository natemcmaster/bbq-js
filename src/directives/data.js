var util = require('../util');

module.exports = function(bbq) {
    bbq.directive('data', function() {
        return {
            link: function(element, $scope, attr) {
                var funcExpr = util.parseEventCall(attr);
                if (!funcExpr) {
                    util.bindAttribute(element, 'textContent', $scope, attr);
                    return;
                }
                var func = $scope.lookup(funcExpr.name);
                if (!util.isFunction(func)) {
                    return console.error('Could not find function "' + attr + '" on $scope');
                }
                var obj = {
                    result: ''
                };
                util.addWatcher(obj, 'result', function(val, trigger) {
                    util.setAttribute(element, 'textContent', val, trigger);
                });
                var update = function(name, val) {
                    var args = funcExpr.args.map(function(arg) {
                        if (arg.type == 'constant')
                            return arg.value;
                        if (arg.type == 'variable'){
                            return (arg.value == name) ? val : $scope.lookup(arg.value);
                        }
                        if (arg.type == '$event')
                            return event;
                    });
                    obj.result = func.apply(element, args);
                };
                for (var a in funcExpr.args) {
                    var arg = funcExpr.args[a];
                    if (arg.type == 'variable') {
                        $scope.$watch(arg.value, function(value) {
                            update(arg.value,value);
                        });
                    }
                }

                update();


            }
        };
    });
};
