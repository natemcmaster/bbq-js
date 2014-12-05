var util=require('../util');

function addEventHandler(element,$scope,attr, eventName){
    var eventCall = util.parseEventCall(attr,function(arg){
        if(arg=='$event')
            return {
                type:'$event'
            };
    });
    var func = (eventCall) ? $scope.lookup(eventCall.name) : null; // null safe
    if (util.isFunction(func)) {
        element.addEventListener(eventName, function(event){
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
    } else {
        console.error('Could not find function "'+eventCall.name+'" on $scope or $rootScope');
    }

}

module.exports = function(bbq) {

    bbq.directive('click', function() {
        return {
            link: function(element, $scope, attr) {
                addEventHandler(element,$scope,attr,'click');
            }
        };
    });

    bbq.directive('submit', function() {
        return {
            link: function(element, $scope, attr) {
                addEventHandler(element,$scope,attr,'submit');
            }
        };
    });
};
