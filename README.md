# Micro AMD

A tiny amd loader with the following features

- asynchronous module fetching
- synchronous requires for preloaded modules
- dependency/nested dependency & relative dependency resolution
- synchronous named module registration
- asynchronous anonymous module resolution
- asynchronous non-registering modules
- local synchronous requires
- object literals
- optional base path


## usage
```js
var amd = require('micro-amd')
var api = amd({ base: 'http://example.com' })

amd.require(['require', 'module-a', 'module-a/lib/helper'], function callback (require) {
  // do stuff
})

amd.define('noop', [], function callback () {
  return function noop () {}
})

var noop = require('noop')
// noop()

amd.require(['noop'], function callback (noop) {
  // noop()
})

```

## run tests
```js
npm test
```
