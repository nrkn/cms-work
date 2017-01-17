# notes

## templating

- Check that faulty models throw error in templates

## components

- All loaded from `/data` - needs some kind of manager eg if you want to upload
  one, bring one in from some module or whatever
- Probably need an `options.json` as well

## 1tree

- `registerNodeType`
- `equals`
- `indexOf`
- are children sliced atm in default adapter?

### 1tree wrap-nodes plugin

Really annoying when debugging

But use cases it allows makes it awesome

Add get properties `_value` and `_children`, that return clones - being getters
they won't incur overhead unless called but debugger will see them

Could also simplify the fn (not fun to step through!) so that all plugins,
builtins etc take same initial signature, or even just:

```javascript
( fn, state, ...args ) => {
  const { root, currentNode, childNode, etc } = state
  // ...
}
```

## 1tree-json & 1tree-schema

- Convert to adapter
- Implement empty, accepts

## 1tree-component

## 1tree-routing

