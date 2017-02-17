'use strict'

const Htree = require( 'mojule-dom' )
const utils = require( 'mojule-utils' )

const { clone } = utils

const tokens = [
  'tag', 'text', 'html', 'if', 'not', 'each', 'empty', 'context', 'include'
]

const tokenSelector = token => `[data-${ token }]`
const selectors = tokens.map( tokenSelector )

const resolve = ( scope, propertyName ) => {
  if( typeof scope.current === 'object' && propertyName in scope.current )
    return scope.current[ propertyName ]

  if( propertyName === '.' )
    return scope.current

  if( scope.parent )
    return resolve( scope.parent, propertyName )
}

const actionWhitelist = [
  'tagName', 'attr', 'removeAttr', 'addClass', 'removeClass', 'toggleClass',
  'clearAttrs', 'clearClasses', 'attributes', 'addClasses'
]

const handleAction = ( el, action ) =>
  Object.keys( action )
    .filter( fname =>
      actionWhitelist.includes( fname )
    )
    .forEach( fname => {
      let args = action[ fname ]

      if( !Array.isArray( args ) )
        args = [ args ]

      el[ fname ]( ...args )
    })

const defaultOptions = {
  logger: ( ...args ) => console.log( JSON.stringify( args ) )
}

const wrapFn = ( fn, onArgs, onResult, fname = '' ) => {
  const wrapped = ( ...args ) => {
    onArgs( args, fname )

    const result = fn( ...args )

    onResult( result, fname )

    return result
  }

  return wrapped
}

const wrapApi = ( api, onArgs, onResult ) => {
  const fnames = Object.keys( api )

  const wrapped = fnames.reduce( ( wrappedApi, fname ) => {
    const fn = api[ fname ]

    wrappedApi[ fname ] = wrapFn( fn, onArgs, onResult, fname )

    return wrappedApi
  }, {} )

  return wrapped
}

const Templating = ( templates, options ) => {
  options = Object.assign( {}, defaultOptions, options )

  const { logger } = options
  const isLogger = typeof logger === 'function'
  let depth = 0

  const getTemplateFragment = name => Htree( clone( templates[ name ] ) )

  let populateEl = {
    tag: ( el, scope, value ) => {
      if( value === undefined ) return

      if( !Array.isArray( value ) )
        value = [ value ]

      value.forEach( action => handleAction( el, action ) )
    },
    text: ( el, scope, value ) => {
      el.empty()

      if( value === undefined ) return

      const textNode = el.createText( value )

      el.append( textNode )
    },
    html: ( el, scope, value ) => {
      if( value === undefined ){
        el.empty()
        return
      }

      const children = el.parse( value )

      el.append( children )
    },
    if: ( el, scope, value ) => {
      if( !value ) el.empty()
    },
    not: ( el, scope, value ) => {
      if( value ) el.empty()
    },
    each: ( el, scope, value ) => {
      if( value === undefined ){
        el.empty()

        return
      }

      if( !Array.isArray( value ) ){
        populateEl.context( el, scope, value )

        return
      }

      const children = el.empty()

      value.forEach( item => {
        const childScope = {
          parent: scope,
          current: item
        }

        children
          .forEach( child => {
            el.append( child.clone() )
          })

        populateNext( el, childScope )
      })
    },
    empty: ( el, scope, value ) => {
      if( value === undefined ){
        el.empty()
        return
      }

      if( !Array.isArray( value ) || value.length > 0 )
        el.empty()
    },
    context: ( el, scope, value ) => {
      if( value === undefined ) return

      const newScope = {
        parent: null,
        current: value
      }

      populateNext( el, newScope )
    },
    include: ( el, scope, value ) => {
      el.empty()

      if( value === undefined ) return

      el.append( getTemplateFragment( value ) )
    }
  }

  if( isLogger ){
    const onArgs = args => {
      const el = args[ 0 ]
      const scope = args[ 1 ]
      const value = args[ 2 ]

      logger( 'populateEl args', 'value:', value )
    }

    const onResult = () => {}

    populateEl = wrapApi( populateEl, onArgs, onResult )
  }

  const populateNext = ( template, scope ) => {
    const next = template.select( selectors.join( ', ' ) )

    if( !next )
      return template

    const currentToken = tokens.find( token =>
      next.matches( tokenSelector( token ) )
    )

    const attrName = 'data-' + currentToken
    const name = next.attr( attrName )

    if( isLogger )
      logger( 'populateNext', currentToken, name )

    if( currentToken === 'include'){
      populateEl.include( next, scope, name )
    } else {
      const value = resolve( scope, name )

      populateEl[ currentToken ]( next, scope, value )

      if( value !== undefined ){
        scope = {
          parent: scope,
          current: value
        }
      }
    }

    next.removeAttr( attrName )

    return populateNext( template, scope )
  }

  const unwrapFragmentChildren = fragment => {
    const notFragment = fragment.find( n => !n.matches( 'fragment' ) )

    if( !notFragment ) return fragment

    const fragmentParent = fragment.getParent()

    fragmentParent.insertBefore( notFragment, fragment )

    return unwrapFragmentChildren( fragment )
  }

  const unwrapNextFragment = template => {
    const fragment = template.select( 'fragment' )

    if( !fragment ) return template

    unwrapFragmentChildren( fragment )

    fragment.remove()

    return unwrapNextFragment( template )
  }

  /*
    I'm not sure that it is working correctly as we may be doing things like
    setting the context before an include has been added, for example.

    Try perhaps adding all the includes first?
  */

  const populate = ( name, model ) => {
    const template = getTemplateFragment( name )

    const scope = {
      parent: null,
      current: model
    }

    populateNext( template, scope )
    unwrapNextFragment( template )

    return template
  }

  return populate
}

Templating.getTemplates = htree => {
  if( typeof htree === 'string' )
    htree = Htree( htree )

  const templateEls = htree.clone().selectAll( 'template[id]:not([id=""])' )

  return templateEls.reduce( ( templates, el ) => {
    const id = el.attr( 'id' )

    const fragment = htree.createDocumentFragment()

    el.getChildren().forEach( child => fragment.append( child ) )

    templates[ id ] = fragment.serialize()

    return templates
  }, {})
}

module.exports = Templating
