'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Tree = require('1tree');
var T = require('mtype');
var paths = require('./paths');

var pathFromNode = paths.pathFromNode,
    nodeFromPath = paths.nodeFromPath;


var t = T();

var valueTypes = ['string', 'number', 'boolean'];

var extendValue = function extendValue(node, value) {
  return node.value(Object.assign({}, node.value(), value));
};

var toNode = function toNode(jsonObj, parent) {
  var create = parent ? parent.createNode : Tree.createRoot;

  var nodeType = t.of(jsonObj);
  var value = { nodeType: nodeType };

  if (valueTypes.includes(nodeType)) value.nodeValue = jsonObj;

  var node = create(value);

  if (nodeType === 'array') {
    jsonObj.forEach(function (el, index) {
      var arrayItemNode = toNode(el, node);

      extendValue(arrayItemNode, { arrayIndex: index });

      node.append(arrayItemNode);
    });
  } else if (nodeType === 'object') {
    var propertyNames = Object.keys(jsonObj);

    propertyNames.forEach(function (name) {
      var propertyValue = jsonObj[name];
      var valueNode = toNode(propertyValue, node);

      extendValue(valueNode, { propertyName: name });

      node.append(valueNode);
    });
  }

  return node;
};

var toTree = function toTree(jsonObj) {
  return toNode(jsonObj, null);
};

var toJson = function toJson(tree) {
  var value = tree.value();
  var nodeType = value.nodeType;

  if (nodeType === 'null') return null;

  if (valueTypes.includes(nodeType)) return value.nodeValue;

  if (nodeType === 'array') return tree.getChildren().map(toJson);

  if (nodeType === 'object') {
    var _ret = function () {
      var obj = {};

      tree.getChildren().forEach(function (nameValueNode) {
        var value = nameValueNode.value();
        var propertyName = value.propertyName;

        var propertyValue = toJson(nameValueNode);

        obj[propertyName] = propertyValue;
      });

      return {
        v: obj
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }

  throw new Error('Unexpected node');
};

module.exports = { toTree: toTree, toJson: toJson, pathFromNode: pathFromNode, nodeFromPath: nodeFromPath };