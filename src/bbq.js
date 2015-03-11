var bbq = require('./main');

// create global instance
global.bbq = new bbq();
require('./directives/').forEach(function(directive) {
    directive(global.bbq);
});

document.addEventListener('DOMContentLoaded', function() {
    if (window.bbq.DOMLoaded) // intentionally may throw reference error
        return;
    window.bbq.bootstrap();
});
