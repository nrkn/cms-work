'use strict'

const htmlparser2 = require( 'htmlparser2' )
const Adapter = require( './htmlparser2-adapter' )

const parse = str => new Promise( ( resolve, reject ) => {
  const adapter = Adapter( ( err, dom ) => {
    if( err ){
      reject( err )
    } else {
      resolve( dom )
    }
  })

  const parser = new htmlparser2.Parser( adapter )

  parser.write( str )
  parser.done()
})

module.exports = parse
