'use strict'

const Templates = require( '../../templates' )
const RenderCss = require( './renderCss' )
const RenderClientScripts = require( './renderClientScripts' )

const RenderNode = dependencies => {
  const renderCss = RenderCss( dependencies )
  const renderClientScripts = RenderClientScripts( dependencies )

  const { configs } = dependencies
  const { renderComponent } = Templates( dependencies )

  const defaultConfig = {
    containerSelector: "[data-container]"
  }

  const addCssToDocumentHead = node => {
    const value = node.value()
    const componentName = value.name
    const componentModel = value.model

    const css = renderCss( node )

    if( !Array.isArray( componentModel.headStyles ) )
      componentModel.headStyles = []

    componentModel.headStyles.push({
      text: css
    })

    node.value( value )
  }

  const addScriptsToDocumentBody = node => {
    const value = node.value()
    const componentName = value.name
    const componentModel = value.model

    const js = renderClientScripts( node )

    if( !Array.isArray( componentModel.scripts ) )
      componentModel.scripts = []

    componentModel.scripts.push({
      text: js
    })

    node.value( value )
  }

  const renderNode = node => {
    const value = node.value()
    const componentName = value.name
    const componentModel = value.model

    if( componentName === 'document' ){
      addCssToDocumentHead( node )
      addScriptsToDocumentBody( node )
    }

    const dom = renderComponent( componentName, componentModel )
    const config = Object.assign( {}, defaultConfig, configs[ componentName ] )
    const childContainer = dom.matches( config.containerSelector ) ? dom : dom.select( config.containerSelector )
    const children = node.getChildren()

    if( childContainer && children.length ){
      children.forEach( childNode => {
        const childDom = renderNode( childNode )

        if( childContainer.nodeName() === 'ul' || childContainer.nodeName() === 'ol' ){
          /*
            dom.parse always returns a fragment, because the html string could
            contain multiple elements

            perhaps if we see it only has one element, we should return that
            rather than a documentFragment with a single child, but continue to
            use current behaviour if the fragment has multiple children?
          */
          const liNode = dom.parse( '<li></li>' )

          liNode.append( childDom )
          childContainer.append( liNode )

          return
        }

        childContainer.append( childDom )
      })
    }

    return dom
  }

  return renderNode
}

module.exports = RenderNode
