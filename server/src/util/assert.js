'use strict'

module.exports = {
  assert
}

function assert(predicate, message) {
  if (!predicate) throw new Error(message)
}
