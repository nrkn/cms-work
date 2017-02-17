'use strict'

window.enhanceInputChanged = el => {
  const inputRadioIcon = el.closest( '.input-radio-icon' )

  if( inputRadioIcon ){
    const name = el.getAttribute( 'name' )

    const siblings = document.querySelectorAll( `input[type="radio"][name="${ name }"]` )

    Array.from( siblings ).forEach( radio => {
      const inputRadioIcon = radio.closest( '.input-radio-icon' )
      inputRadioIcon.classList.remove( 'input-radio-icon--selected' )
    })

    inputRadioIcon.classList.add( 'input-radio-icon--selected' )
  }
}