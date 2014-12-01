module.exports = function(bbq) {
    bbq.directive('data', function() {
        return {
            link: function(element, scope, attr) {
                createBinding(element, attr, scope, 'textContent');
            }
        };
    });
};
