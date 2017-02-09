# 1tree-json

Converts JSON objects to and from 1tree instances

```javascript
const { toTree, toJson } = require( '1tree-json' )

const jsonData = require( './test-data.json' )

const asTree = toTree( jsonData )

const numbers = asTree.findAll( node => node.value().nodeType === 'number' )

numbers.forEach( numberNode => {
  const value = node.value()

  value.nodeValue *= 2

  node.value( value )
})

const newData = toJson( asTree )

console.log( JSON.stringify( newData, null, 2 ) )
```
