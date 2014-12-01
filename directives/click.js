var util=require('../util');

module.exports = function(bbq) {

    bbq.directive('click', function() {
        return {
            link: function(element, scope, attr) {
                var eventCall = util.parseEventCall(attr);
                if (eventCall && util.isFunction(scope[eventCall.name])) {
                    element.addEventListener('click', scope[eventCall.name], false);
                }
            }
        };
    });
};
