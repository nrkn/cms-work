const Html = require( 'html' )
const Htree = require( 'htree' )
const pify = require( 'pify' )
const fs = require( 'fs' )

const writeFile = pify( fs.writeFile )

const html = Html()

// console.log( html )

/*
console.log( html.tagNames() )
console.log( html.categoryNames() )

console.log( 'ul', 'li', html.accepts( 'ul', 'li' ) )
console.log( 'ul', 'div', html.accepts( 'ul', 'div' ) )
*/
const htree = Htree()

htree.parse( '<div id="cool"><strong>Hello</strong>, </div>World!<!--Hello, --><!--World!--><?PITarget PIContent?><img src="logo.svg" alt="Logo" />' )
  .then( htree.stringify )
  .then( console.log )