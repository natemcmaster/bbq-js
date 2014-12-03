module.exports = function(bbq)
{
    bbq.directive('src',function(){
        return {
            link: function(element, $scope, attr)
            {
                element.setAttribute('src',$scope.lookup(attr));
            }
        };
    });
};
