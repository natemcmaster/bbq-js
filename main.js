var util = require('./util'),
    Scope = require('./scope');

function processTextNode(el, $scope) {
    var str = el.textContent;
    var matches = str.match(/\{\{\s*([\w^}])+\s*\}\}/g); /// find bracket tags
    if (!matches)
        return;
    var nodes = [];
    var unprocessed = str;
    for (var i = 0; i < matches.length; i++) {
        var tag = matches[i];
        var n = unprocessed.indexOf(tag);
        if (n > 0) {
            var t = document.createTextNode(unprocessed.substring(0, n));
            nodes.push(t);
        }

        var name = tag.replace(/[{}\s]/g, '');

        var span = document.createTextNode('');
        util.createBinding(span, name, $scope, 'textContent');
        nodes.push(span);

        unprocessed = unprocessed.slice(n + tag.length);
    }
    if (unprocessed)
        nodes.push(document.createTextNode(unprocessed));

    if (!nodes.length)
        return;
    var parentNode = el.parentNode;
    var lastNode = nodes[nodes.length - 1];
    parentNode.replaceChild(lastNode, el);
    for (var i = 0; i < nodes.length - 1; i++) {
        parentNode.insertBefore(nodes[i], lastNode);
    }
}

// Master class BBQ

function bbq() {
    this.__controllers = {};
    this.__directives = {};
}

// Class Controller

bbq.prototype.controller = function(name, init) {
    var c = {
        name: name,
        $scope: new Scope()
    };
    init(c.$scope);
    this.__controllers[name] = c;
};

bbq.prototype.directive = function(key, processor) {
    var obj = processor();
    if (!util.isFunction(obj.link))
        throw new Error('Directive must have link function');
    this.__directives['bbq-' + key] = obj;
};

bbq.prototype.bootstrap = function() {
    global.document.removeEventListener('DOMContentLoaded', arguments.callee, false);


    this.visitChildren(global.document.body, null, this.processor.bind(this));

    this.DOMLoaded = true;
};

bbq.prototype.processor = function(element, $scope) {
    if (!$scope)
        return;

    if (element.nodeType == Node.TEXT_NODE) {
        processTextNode(element, $scope); // text nodes bound to data
    }

    if (!element.getAttribute)
        return;

    for (var x in element.attributes) {
        var key = element.attributes[x].name;
        if (!this.__directives[key])
            continue;
        var value = element.getAttribute(key);
        this.__directives[key].link.call(this, element, $scope, value);
        element.removeAttribute(key);
    }

};

bbq.prototype.visitChildren = function(element, controller, action) {
    if (!element.childNodes)
        return;
    if (element.getAttribute) {
        var att = element.getAttribute('bbq-controller');
        if (att && this.__controllers[att]) {
            controller = this.__controllers[att];
            element.removeAttribute('bbq-controller');
        }
    }
    if (controller)
        action(element, controller.$scope);
    for (var i = 0; i < element.childNodes.length; i++) {
        this.visitChildren(element.childNodes[i], controller, action);
    }
};

module.exports = bbq;
