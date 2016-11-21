const Htree = require( 'htree' )

const html = '<div id="cool"><strong>Hello</strong>, </div>World!<!--Hello, --><!--World!--><?PITarget PIContent?><img src="logo.svg" alt="Logo" />'

const htree = Htree( html )

const strong = htree.select( 'strong' )
const div = htree.select( 'div' )

div.attr( 'id', 'uncool' )

strong.addClass( 'soVeryStrong' )
strong.addClass( 'wellPrettyStrong' )

strong.addClass( 'iGuess' )
strong.removeClass( 'iGuess' )

strong.addClass( 'iGuess2' )
strong.toggleClass( 'iGuess2' )

strong.toggleClass( 'iGuess3' )

const span = htree.createElement( 'span', { id: 'coolSpan' } )

htree.append( span )

console.log( JSON.stringify( htree.get(), null, 2 ) )
console.log( htree.isDocumentFragment() )
console.log( htree.stringify() )
console.log( strong.get() )
console.log( div.matches( '#uncool' ) )
console.log( div.attr( 'id' ) )

const newTree = Htree.createTree( { value: { nodeType: 'element', tagName: 'main' }, children: [] } )

newTree.append( htree )

console.log( JSON.stringify( newTree.get(), null, 2 ) )
