'use strict';

var slugFromNode = function slugFromNode(node) {
  var parent = node.getParent();

  if (!parent) return '$';

  var value = node.value();

  if (typeof value.propertyName === 'string') return value.propertyName;

  if (typeof value.arrayIndex === 'number') return value.arrayIndex + '';
};

var pathFromNode = function pathFromNode(node) {
  var parentWithSlug = node.closest(function (n) {
    return !!slugFromNode(n) && n.get() !== node.get();
  });

  if (!parentWithSlug) return '$';

  var parentPath = pathFromNode(parentWithSlug);
  var slug = slugFromNode(node);

  if (slug) return parentPath + '/' + slug;
};

var nodeFromPath = function nodeFromPath(tree, path) {
  return tree.find(function (node) {
    return path === pathFromNode(node);
  });
};

module.exports = { pathFromNode: pathFromNode, nodeFromPath: nodeFromPath };