# notes

## templating

- Check that faulty models throw error in templates

## components

- All loaded from `/data` - needs some kind of manager eg if you want to upload
  one, bring one in from some module or whatever
- Should most inputs share a common template? How does inherit work with
  templates?

## dependencies

Use [depject](https://github.com/depject/depject) for dependencies, this is a
bit of work!

## schema/json trees

Consider changing the path code to return something more like dot notation eg
`/buttonIcon/buttonClasses/0` would look like `buttonIcon.buttonClasses[0]`

## 1tree

- Refactor to use `depject` because it solves a lot of friction problems we are
  having such as having to implement things using two different but similar
  syntaxes, one where partial application is happening and nodes etc are being
  wrapped, and one without

- `equals` - implementation is a.get() === b.get()
- `schema` - add to base as an empty schema `{}` that will always validate true
- `validate` - using schema
- `attributes` - again, move from dom to support all - attribute values always
  need to be strings for serialization, this allows eg form posts, various
  scenarios - *if* the schema is present, we know how to map these strings to
  and from their true data types
- `dataMap` - may need to be on dom instead - uses a transform map(?) and schema
  to allow properties in the `value: {}` object to be mapped to data- attributes
  eg the use of attributes that don't appear in the `attr: {}` object
- `registerNodeType` - yes, no, maybe - other ways to deal with this?

### 1tree wrap-nodes plugin

Really annoying when debugging

But use cases it allows makes it awesome

We added properties `_value` and `_children`, that return clones - being getters
they won't incur overhead unless called but debugger will see them

Could simplify the fn (not fun to step through!) so that all plugins,
builtins etc take same initial signature, or even just:

```javascript
( fn, state, ...args ) => {
  const { root, currentNode, childNode, etc } = state
  // ...
}
```

## 1tree-component

- Needs to exists, firstly - at the moment it's a pseudo-tree
- The component api eg header( model, [ children ] ) should not need children
  to be wrapped in an array

## 1tree-routing

