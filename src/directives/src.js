module.exports = function(bbq)
{
    bbq.directive('src',function(){
        return {
            link: function(element, $scope, attr)
            {
                var src=$scope.lookup(attr);
                if(src)
                    element.setAttribute('src',src);
                $scope.$watch(attr,function(value){
                    if(value)
                        element.setAttribute('src',value);
                });
            }
        };
    });
};
