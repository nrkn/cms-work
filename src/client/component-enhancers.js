'use strict'

const radioIcon = el => {
  const inputRadioIcon = el.closest( '.input-selectable-icon--radio' )

  if( inputRadioIcon ) {
    const name = el.getAttribute( 'name' )

    const siblings = document.querySelectorAll( `input[type="radio"][name="${ name }"]` )

    Array.from( siblings ).forEach( radio => {
      const radioComponent = radio.closest( '.input-selectable-icon--radio' )

      if( radio.checked ) {
        radioComponent.classList.add( 'input-selectable-icon--selected' )
      } else {
        radioComponent.classList.remove( 'input-selectable-icon--selected' )
      }
    })
  }
}

const checkboxIcon = el => {
  const inputCheckboxIcon = el.closest( '.input-selectable-icon--checkbox' )

  if( inputCheckboxIcon ) {
    if( el.checked ) {
      inputCheckboxIcon.classList.add( 'input-selectable-icon--selected' )
    } else {
      inputCheckboxIcon.classList.remove( 'input-selectable-icon--selected' )
    }
  }
}

window.enhanceInputChanged = el => {
  radioIcon( el )
  checkboxIcon( el )
}