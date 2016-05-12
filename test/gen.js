var path = require('path')
var fs = require('fs')

var x = 100

while (x--) {
  fs.writeFile(path.join(__dirname, 'fixtures/battle', x + '-anon.js'), anon(x), noop)
  fs.writeFile(path.join(__dirname, 'fixtures/battle', x + '-named.js'), named(x), noop)
  fs.writeFile(path.join(__dirname, 'fixtures/battle', x + '-literal.js'), literal(x), noop)
  fs.writeFile(path.join(__dirname, 'fixtures/battle', x + '-global.js'), globalRegister(x), noop)
}

function anon (val) {
  return `window.define(function () {
  return ${val} + '-anon'
})
`
}

function named (val) {
  return `window.define('${val}-named', [], function () {
  return ${val} + '-named'
})
`
}

function literal (val) {
  return `window.define({
  value: ${val} + '-literal'
})
`
}

function globalRegister (val) {
  return `
window.globalRegister = window.globalRegister || {}
window.globalRegister['${val}-global'] = true
`
}

function noop () {}
