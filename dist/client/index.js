(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// setup the drake (dragula instance) for our composer drag drop requirements

var Drake = function Drake(deps) {
  var cloneSelector = '.composer-node__toolbar [data-dragsource="composer"]';
  var containerSelector = '[data-dragsource="composer"]';
  var updateNode = deps.updateNode,
      dragula = deps.dragula,
      find = deps.find,
      ondrop = deps.ondrop;


  var isContainer = function isContainer(el) {
    return el.matches(containerSelector);
  };

  var accepts = function accepts(el, containerEl) {
    var accepts = containerEl.matches(containerSelector);

    if (accepts) {
      accepts = !containerEl.matches(cloneSelector);
    }

    if (accepts) {
      var node = find.elNode(el);
      var parentNode = find.containerElNode(containerEl);

      if (node === parentNode) return false;

      accepts = parentNode.accepts(node);
    }

    return accepts;
  };

  var options = { isContainer: isContainer, accepts: accepts };

  var drake = dragula(options);

  drake.on('drop', function (el, containerEl, sourceContainerEl, nextEl) {
    var node = find.elNode(el);
    var parentNode = find.containerElNode(containerEl);

    if (nextEl) {
      var referenceNode = find.elNode(nextEl);
      parentNode.insertBefore(node, referenceNode);
    } else {
      parentNode.append(node);
    }

    updateNode(node);

    ondrop(node, parentNode, el, containerEl, sourceContainerEl, nextEl);
  });

  return drake;
};

module.exports = Drake;

},{}],2:[function(require,module,exports){
'use strict';

// functions for finding different tree node types in the composer DOM

var Find = function Find(idMap) {
  var nodeEl = function nodeEl(el) {
    return el.querySelector('.composer-node');
  };
  var containerEl = function containerEl(el) {
    return el.closest('.composer-node');
  };
  var elNode = function elNode(el) {
    return idMap.findById(nodeEl(el).id);
  };
  var containerElNode = function containerElNode(el) {
    return idMap.findById(containerEl(el).id);
  };

  return { nodeEl: nodeEl, containerEl: containerEl, elNode: elNode, containerElNode: containerElNode };
};

module.exports = Find;

},{}],3:[function(require,module,exports){
'use strict';

/*
  cache that maps between tree nodes and their DOM representations using the id
  attribute
*/

var IdMap = function IdMap(tree) {
  var idMap = new Map();

  var findById = function findById(id) {
    if (idMap.has(id)) return idMap.get(id);

    var node = tree.find(function (n) {
      return n.id() === id;
    });

    idMap.set(id, node);

    return node;
  };

  var refresh = function refresh(node) {
    node.walk(function (n) {
      return idMap.set(n.id(), n);
    });
  };

  refresh(tree);

  return Object.assign(idMap, { findById: findById, refresh: refresh });
};

module.exports = IdMap;

},{}],4:[function(require,module,exports){
'use strict';

var IdMap = require('./idmap');
var Drake = require('./drake');
var Find = require('./find');

var Composer = function Composer(deps, state) {
  var dragula = deps.dragula,
      morphdom = deps.morphdom,
      document = deps.document,
      renderNode = deps.renderNode;
  var _tree = state.tree,
      options = state.options;


  var _idMap = IdMap(_tree);
  var find = Find(_idMap);

  var composerView = document.querySelector(options.selector);

  morphdom(composerView, _tree.stringify());

  composerView.addEventListener('click', function (e) {
    var el = e.target;

    if (el.matches('.composer-node__toolbar')) {
      el.parentNode.classList.toggle('collapsed');

      var isCollapsed = el.parentNode.matches('.collapsed');
      var isNode = el.parentNode.matches('.composer-node');

      var node = isNode ? _idMap.findById(el.parentNode.id) : find.containerElNode(el.parentNode);

      var key = isNode ? 'isCollapsed' : 'isChildrenCollapsed';

      toggle(node, key, isCollapsed);
    } else if (el.matches('.composer-node__delete')) {
      var shouldDelete = window.confirm('Are you sure?');

      if (!shouldDelete) return;

      var id = el.parentNode.parentNode.id;

      var _node = _idMap.findById(id);
      var parentNode = _node.getParent();

      _node.remove();

      var parentEl = document.getElementById(parentNode.id());
      var depth = parentEl.dataset.depth * 1;

      var html = renderNode(parentNode, { depth: depth });

      updateView(parentEl, html);
    }
  });

  var updateView = function updateView(el, html) {
    var template = document.createElement('template');
    template.innerHTML = html;

    var newEl = template.content.querySelector('.composer-node');

    var result = morphdom(el, newEl);
  };

  var updateNode = function updateNode(node) {
    var nodeEl = document.getElementById(node.id());
    var parentNode = node.getParent();

    var depth = 0;
    var parentEl = void 0;

    if (parentNode) {
      parentEl = document.getElementById(parentNode.id());
      depth = parentEl.dataset.depth * 1 + 1;
    }

    var newElHtml = renderNode(node, { depth: depth });

    updateView(nodeEl, newElHtml);
  };

  var _dropHandler = void 0;

  var ondrop = function ondrop() {
    if (_dropHandler) _dropHandler.apply(undefined, arguments);

    console.log('\n\n\n');

    _tree.walk(function (current, parent, depth) {
      var indent = '  '.repeat(depth);
      var value = current.value();
      var name = value.name || value.type;

      console.log(indent + name + '#' + current.id());
    });
  };

  var drakeDeps = { dragula: dragula, updateNode: updateNode, find: find, ondrop: ondrop };

  var drake = Drake(drakeDeps);

  var toggle = function toggle(node, key, isCollapsed) {
    node.meta(key, isCollapsed);

    if (!isCollapsed) updateNode(node);
  };

  var api = {
    remove: function remove() {
      return composerView.innerHTML = '';
    },
    tree: function tree() {
      return _tree;
    },
    idMap: function idMap() {
      return _idMap;
    },
    dropHandler: function dropHandler(handler) {
      return _dropHandler = handler;
    }
  };

  return api;
};

module.exports = Composer;

},{"./drake":1,"./find":2,"./idmap":3}],5:[function(require,module,exports){
'use strict';

var Composer = require('./composer');

window.mojule = { Composer: Composer };

},{"./composer":4}]},{},[5]);
