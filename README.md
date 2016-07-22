# Micro AMD

A tiny, reliable amd module resolver for the browser

## usage
```js
var amd = require('micro-amd')
var api = amd({ base: 'http://example.com' })

// module definition
amd.define('noop', [], function callback () {
  return function noop () {}
})

// synchronous require
var noop = require('noop')
// noop()

// asynchronous require
amd.require(['noop'], function callback (noop) {
  // noop()
})

// require util, submodules
amd.require(['require', 'module-a/lib/helper'], function callback (require) {
  var helper = require('module-a/lib/helper')
})

//anonymous defines

// anon.js
amd.define(function () {
  return 'boop'
})

// consumer
amd.require('anon', function (anon) {
  console.log(anon) // boop
})

// common.js
amd.define(['require', 'module', 'exports'], function (require, module, exports) {
  module.exports = 'cjs'
})
```

## run tests
```js
npm test
```

## Want to work on this for your day job?

This project was created by the Engineering team at Qubit. As we use open source libraries, we make our projects public where possible.

We’re currently looking to grow our team, so if you’re a JavaScript engineer and keen on ES2016 React+Redux applications and Node micro services, why not get in touch? Work with like minded engineers in an environment that has fantastic perks, including an annual ski trip, yoga, a competitive foosball league, and copious amounts of yogurt.

Find more details on our Engineering site. Don’t have an up to date CV? Just link us your Github profile! Better yet, send us a pull request that improves this project.`
Contact GitHub API Training Shop Blog About
