'use strict'

const Dom = require( 'mojule-dom' )

const transformHtml = value => {
  const dom = Dom( value )

  // The doctype is read by the parser as a processing intruction and
  // converted to a comment. We need to find any comments starting
  // with '!doctype' and convert them to a documentType node
  //
  // Assumes you are always using a standard HTML5 doctype, because
  // we never use anything else
  dom.walk( n => {
    const value = n.value()

    if( value.nodeType === 'comment' && value.nodeValue.startsWith( '!doctype' ) ){
      value.nodeType = 'documentType'

      delete value.nodeValue

      value._id = value._id.replace( 'comment-', 'documentType-' )

      value.name = 'html'
      value.publicId = ''
      value.systemId = ''

      n.value( value )
    }
  })

  return dom.serialize()
}

module.exports = transformHtml
