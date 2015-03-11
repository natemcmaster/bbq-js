module.exports = function(bbq)
{
    bbq.directive('class-active-if',function(){
        return {
            link: function(element, $scope, attr)
            {
                var inverted= false;
                if(attr.substr) {
                    inverted = attr.substr(0,1)==='!';
                    if(inverted)
                        attr = attr.substr(1);
                }
                function setClass(src){
                    src = inverted ? !src : !!src;
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
