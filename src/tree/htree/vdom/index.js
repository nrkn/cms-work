'use strict'

const Vnode = ( root, node ) => {
  const vnode = {
    get firstChild(){
      return node.firstChild()
    },

    get nextSibling(){
      return node.nextSibling()
    },

    get nodeType(){
      return node.nodeType()
    },

    get nodeName(){
      return node.nodeName()
    },

    // should be something for svg or math etc.!
    get namespaceURI(){
      return 'http://www.w3.org/1999/xhtml'
    },

    get nodeValue(){
      const value = node.value()

      return value.nodeValue || ''
    },

    get value(){
      const value = node.value()

      return value.value
    },

    get selected(){
      const value = node.value()

      return !!value.selected
    },

    get disabled(){
      const value = node.value()

      return !!value.disabled
    },

    // should be something for svg or math etc.!
    // hasAttributeNS: ( namespaceURI, name ) => {
    hasAttributeNS: namespaceURI => 
      namespaceURI === vnode.namespaceURI,

    assignAttributes: targetNode => {
      const attributes = node.attributes()

      Object.keys( attributes ).forEach( name =>
        targetNode.setAttribute( name, attributes[ name ] )
      )
    }
  }

  return vnode
}

const vdom = htree => {

}

module.exports = vdom
