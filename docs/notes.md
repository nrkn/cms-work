# notes

## templating

- Check that faulty models throw error in templates

## components

- All loaded from `/data` - needs some kind of manager eg if you want to upload
  one, bring one in from some module or whatever
- Probably need an `options.json` as well

### Use a tree for rendering:

```javascript
{
  value: {
    name: 'document',
    model: { ... },
    childContainer: '[data-container]'
  },
  children: [

  ]
}
```

## 1tree

- `equals` - implementation is a.get() === b.get()
- `indexOf`
- `slug` - returns a unique-within-siblings string for building paths. The
  default implementation is simply indexOf - so paths would look like 0/1/2/0
  etc.
- `getPath`, `findForPath` (naming?) - uses slugs
- are children sliced atm in default adapter? (don't think so - performance)
- consider making class/tags a base feature and not just in dom - classes are
  effectively the same thing as tags!
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

## 1tree-json & 1tree-schema

- Convert to adapter or patch the tree in `toTree` (probs the latter)
- Implement empty, accepts

## 1tree-component

## 1tree-routing

