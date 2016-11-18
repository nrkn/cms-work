'use strict'

const Html = require( 'html' )
const info = Html()

const toHtml = ( node, depth, prev, indent ) => {
  let html = ''
  let nl = ''
  let lineIndent = ''

  if( typeof indent === 'string' ){
    lineIndent = indent.repeat( depth )
    nl = '\n'
  }

  if( node.value.nodeType === 'text' ){
    html += node.value.nodeValue
  }

  if( node.value.type === 'element' ){
    html += `${ lineIndent }<${ node.value.tagName }`

    if( node.value.attributes )
      Object.keys( node.value.attributes ).forEach( name => {
        const value = node.value.attributes[ name ]

        html += ` ${ name }`

        if( value )
          html += `="${ value }"`
      })

    if( html )
    html += `>${ nl }`
  }

  if( node.value.type === 'tag' )
    depth++

  let current
  node.children.forEach( child => {
    html += toHtml( child, depth, current )
    current = child
  })

  if( node.value.type === 'tag' ){
    html += ( '\n' + indent + '</' + node.value.name + '>\n' )
  }

  return html
}

const stringify = ( node, indent ) => {
  indent =  typeof indent === 'number' ? ' '.repeat( indent ) : indent

  return toHtml( node, 0, null, indent )
}

module.exports = stringify
