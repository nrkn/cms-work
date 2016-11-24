'use strict'

const EntityNode = require( 'tree/entity-node' )

const DomHandler = options => {
  const state = State( options )

  const handler = { state }

  const api = Api( handler )

  return api
}

//default options
const defaultOpts = {
	normalizeWhitespace: false
}

const whitespace = /\s+/g;

const State = options => {
  options = options || defaultOpts

  const dom = EntityNode( 'documentFragment' )
  const done = false
  const tagStack = []
  const parser = null

  const state = {
    options, dom, done, tagStack, parser
  }

  return state
}

const Api = handler => {
  const oninit = parser => handler.state.parser = parser

  const onreset = () => {
    const { options } = handler.state

    handler.state = State( options )
  }

  const onend = () => {
    if( handler.state.done ) return

    handler.state.done = true
    handler.state.parser = null
    onerror( null )
  }

  const onerror = err => {
    if( err ) throw err
  }

  const onclosetag = () => {
    const { tagStack } = handler.state

    tagStack.pop()
  }

  const onopentag = ( name, attribs ) => {
    const { tagStack } = handler.state

    const element = EntityNode({
      tagName: name,
      attributes: attribs
    }, 'element' )

    addDomElement( handler, element )
    tagStack.push( element )
  }

  const ontext = data => {
    const { options } = handler.state

    const normalize = options.normalizeWhitespace || options.ignoreWhitespace ?
      str => str.replace( whitespace, ' ' ) :
      str => str

    const previousText = findPreviousText( handler )

    if( previousText ){
      previousText.value.nodeValue = normalize( previousText.nodeValue + data )
    } else {
      data = normalize( data )

      const text = EntityNode( { nodeValue: data }, 'text' )

      addDomElement( handler, text )
    }
  }

  const oncomment = data => {
    const { tagStack } = handler.state

    const lastTag = tagStack[ tagStack.length - 1 ]

    if( lastTag && lastTag.value.nodeType === 'comment' ){
      lastTag.value.nodeValue += data

      return
    }

    const comment = EntityNode( { nodeValue: data }, 'comment' )

    addDomElement( handler, comment )
    tagStack.push( comment )
  }

  const onprocessinginstruction = ( name, data ) => {
    oncomment( data )
    oncommentend()
  }

  const oncommentend = () => handler.state.tagStack.pop()

  const getDom = () => handler.state.dom

  const api = {
    oninit, onreset, onend, onerror, onclosetag, onopentag, ontext, oncomment,
    oncommentend, onprocessinginstruction, getDom
  }

  return api
}

const findPreviousText = handler => {
  const { tagStack, dom } = handler.state

  if( tagStack.length ){
    const lastTag = tagStack[ tagStack.length - 1 ]
    const children = lastTag.children

    if( children.length ){
      const lastChild = children[ children.length - 1 ]

      if( lastChild.value.nodeType === 'text' ) return lastChild
    }
  }

  const children = dom.children

  if( !children || !children.length ) return

  const lastChild = children[ children.length - 1 ]

  if( lastChild.value.nodeType === 'text' ) return lastChild
}

const addDomElement = ( handler, element ) => {
  const { tagStack, dom } = handler.state

  const parent = tagStack[ tagStack.length - 1 ]
  const target = parent ? parent.children : dom.children

  target.push( element )
}

module.exports = DomHandler
