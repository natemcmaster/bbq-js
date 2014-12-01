var util=require('../util')

module.exports = function(bbq) {
    bbq.directive('data', function() {
        return {
            link: function(element, scope, attr) {
                util.bindAttribute(element, 'textContent', scope, attr);
            }
        };
    });
};
