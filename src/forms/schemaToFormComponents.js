'use strict'

/*
  object -> fieldset
  array -> fieldset with add/remove controls
  string -> input[type='text']
  number -> input[type='number']
  integer -> input[type='number',min=xxx,max=xxx,step=1]
  boolean -> checkbox
  null -> shouldn't happen! why do you have a schema with nulls as an accepted

  SPECIAL CASES:

  enum -> radio / select

  allOf -> doesn't matter, gets normalized out
  anyOf -> this is weird, don't see a use case for it, throw an unsupported exception
  not -> doesn't make sense, or maybe use input[text]?
  oneOf? -> radio with subfields / mashup of fieldset and radio?

  format -> multiline is textarea instead of input[text], email is input[email] instead etc.
  pattern -> html input supports regex patterns!


  NOTES:

  label comes from title, falls back to id

  hover text comes from description if available, falls back to title

  the existing value comes from default - you can use schema-tree to decorate an
  existing schema with defaults from a model, and not only that, but because
  1tree-schema and 1tree-json both support path, mapping these in is trivial


*/