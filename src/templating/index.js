'use strict'

const Htree = require( 'tree/htree' )
const utils = require( 'utils' )

const { clone } = utils

const tokens = [
  'tag', 'text', 'html', 'is', 'not', 'each', 'empty', 'context', 'include'
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
  'clearAttrs', 'clearClasses', 'attributes'
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

const Templating = templates => {
  const Tree = name => Htree( clone( templates[ name ] ) )

  const populateEl = {
    tag: ( el, scope, value ) => {
      if( !Array.isArray( value ) )
        value = [ value ]

      value.forEach( action => handleAction( el, action ) )
    },
    text: ( el, scope, value ) => {
      el.empty()

      const textNode = el.createText( value )

      el.append( textNode )
    },
    html: ( el, scope, value ) => {
      const children = el.parse( value )

      el.append( children )
    },
    is: ( el, scope, value ) => {
      if( !value ) el.empty()
    },
    not: ( el, scope, value ) => {
      if( value ) el.empty()
    },
    each: ( el, scope, value ) => {
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
      if( !Array.isArray( value ) || value.length > 0 )
        el.empty()
    },
    context: ( el, scope, value ) => {
      const newScope = {
        parent: null,
        current: value
      }

      populateNext( el, newScope )
    },
    include: ( el, scope, value ) => {
      el.empty()
      el.append( Tree( value ) )
    }
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

    if( currentToken === 'include'){
      populateEl[ currentToken ]( next, scope, name )
    } else {
      const value = resolve( scope, name )

      if( value !== undefined ){
        populateEl[ currentToken ]( next, scope, value )

        scope = {
          parent: scope,
          current: value
        }
      }
    }

    next.removeAttr( attrName )

    return populateNext( template, scope )
  }

  const unwrapNextFragment = template => {
    const fragment = template.select( 'fragment' )

    if( !fragment ) return template

    const firstChild = fragment.firstChild()

    if( firstChild ){
      firstChild.unwrap()
    } else {
      fragment.remove()
    }

    return unwrapNextFragment( template )
  }

  const populate = ( name, model ) => {
    const template = Tree( name )

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
  const templateEls = htree.clone().selectAll( 'template' )

  return templateEls.reduce( ( templates, el ) => {
    const id = el.attr( 'id' )

    const fragment = htree.createDocumentFragment()

    el.getChildren().forEach( child => fragment.append( child ) )

    templates[ id ] = fragment.serialize()

    return templates
  }, {})
}

module.exports = Templating
