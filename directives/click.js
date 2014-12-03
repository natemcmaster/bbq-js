var util=require('../util');

module.exports = function(bbq) {

    bbq.directive('click', function() {
        return {
            link: function(element, $scope, attr) {
                var eventCall = util.parseEventCall(attr,function(arg){
                    if(arg=='$event')
                        return {
                            type:'$event'
                        };
                });
                var func = (eventCall) ? $scope.lookup(eventCall.name) : null; // null safe
                if (util.isFunction(func)) {
                    element.addEventListener('click', function(event){
                        var args = eventCall.args.map(function(arg){
                            if(arg.type=='constant')
                                return arg.value;
                            if(arg.type=='variable')
                                return $scope.lookup(arg.value);
                            if(arg.type=='$event')
                                return event;
                        });
                        func.apply(element,args);
                    }, false);
                }
            }
        };
    });
};
