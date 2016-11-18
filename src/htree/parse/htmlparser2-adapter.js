'use strict'

const DomHandler = ( callback, options, elementCB ) => {
  const state = State( callback, options, elementCB )

  const handler = { state }

  const api = Api( handler )

  return api
}

//default options
const defaultOpts = {
	normalizeWhitespace: false
}

const whitespace = /\s+/g;

const State = ( callback, options, elementCB ) => {
	if( typeof callback === 'object' ){
		elementCB = options
		options = callback
		callback = null
	} else if( typeof options === 'function' ){
		elementCB = options
		options = defaultOpts
	}

  options = options || defaultOpts

  const dom = createNode( {}, 'documentFragment' )
  const done = false
  const tagStack = []
  const parser = null

  const state = {
    callback, options, elementCB, dom, done, tagStack, parser
  }

  return state
}

const createNode = ( value, nodeType ) => {
  Object.assign( value, { nodeType } )
  const children = []

  return { value, children }
}

const Api = handler => {
  const oninit = parser => handler.state.parser = parser

  const onreset = () => {
    const { callback, options, elementCb } = handler.state

    handler.state = State( callback, options, elementCb )
  }

  const onend = () => {
    if( handler.state.done ) return

    handler.state.done = true
    handler.state.parser = null
    onerror( null )
  }

  const onerror = err => {
    const { callback, dom } = handler.state

    if( typeof callback === 'function' ){
      callback( err, dom )
      return
    }

    if( err ) throw err
  }

  const onclosetag = () => {
    const { tagStack, elementCB } = handler.state

    const elem = tagStack.pop()

    if( elementCB ) elementCB( elem )
  }

  const onopentag = ( name, attribs ) => {
    const { tagStack } = handler.state

    const element = createNode({
      tagName: name,
      attributes: attribs
    }, 'element' )

    addDomElement( handler, element )
    tagStack.push( element )
  }

  const ontext = data => {
    const { options, tagStack, dom } = handler.state

    const normalize = options.normalizeWhitespace || options.ignoreWhitespace ?
      str => str.replace( whitespace, ' ' ) :
      str => str

    const previousText = findPreviousText( handler )

    if( previousText ){
      previousText.value.nodeValue = normalize( previousText.nodeValue + data )
    } else {
      data = normalize( data )

      const text = createNode( { nodeValue: data }, 'text' )

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

    const comment = createNode( { nodeValue: data }, 'comment' )

    addDomElement( handler, comment )
    tagStack.push( comment )
  }

  const onprocessinginstruction = ( name, data ) => {
    oncomment( data )
    oncommentend()
  }

  const oncommentend = () => handler.state.tagStack.pop()

  const api = {
    oninit, onreset, onend, onerror, onclosetag, onopentag, ontext, oncomment,
    oncommentend, onprocessinginstruction
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
