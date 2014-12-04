module.exports = function(bbq)
{
    bbq.directive('class-active-if',function(){
        return {
            link: function(element, $scope, attr)
            {
                function setClass(src){
                    if(src)
                        element.className+=' active';
                    else
                        element.className = element.className.replace(/active/g,'');
                }
                setClass($scope.lookup(attr));
                $scope.$watch(attr,function(value){
                    setClass(value);
                });
            }
        };
    });
};
