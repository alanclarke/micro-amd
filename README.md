# Micro AMD

A tiny amd loader with the following features


- asynchronous module fetching
- synchronous requires for preloaded modules
- dependency/nested dependency & relative dependency resolution
- synchronous named module registration
- asynchronous anonymous module resolution
- local synchronous requires
- object literals
- optional base path


## usage
```js
var AMD = require('micro-amd')
var amd = amd({ base: 'http://example.com' })

amd.require(['module-a', 'module-a/lib/helper'], function callback (a, helper) {
  // do stuff
})

amd.register('noop', [], function callback () {
  return function noop () {}
})

amd.require(['noop'], function callback (noop) {
  // noop()
})

var noop = require('noop')

```

## run tests
```js
npm test
```
