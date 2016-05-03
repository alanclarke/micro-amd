# Micro AMD

A tiny amd loader with the following features

- asynchronous module fetching
- editable base path
- dependency and nested dependency resolution with relative paths
- arbitrary synchronous and asynchronous module registration
- synchronous requires of loaded modules

## usage
```js
var AMD = require('micro-amd')
var amd = amd({ base: 'http://example.com' })

amd.require(['module-a', 'module-a/internal/method'], function callback (a, method) {
  // resolves when all dependencies have called amd.register
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
