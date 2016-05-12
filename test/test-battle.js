/* globals describe beforeEach afterEach it */
var expect = require('chai').expect
var amd = require('../index')

describe('battle test', function () {
  var api

  beforeEach(function () {
    api = amd({ base: '/base/test/fixtures/battle/' })
    window.define = api.define
  })

  afterEach(function () {
    delete window.define
  })

  it('should reliably get all the modules', function () {
    var reqs = []
    var x = 100
    while (x--) {
      reqs.push.apply(reqs, [
        test(x + '-named', id),
        test(x + '-anon', id),
        test(x + '-literal', lit),
        test(x + '-global', glob)
      ].sort(function () { return Math.random() - 0.5 }))
    }
    return Promise.all(reqs)
  })

  function id (name, val) {
    return val
  }

  function lit (name, val) {
    return val.value
  }

  function glob (name, val) {
    return window.globalRegister[name] && name
  }

  function test (name, getValue) {
    return new Promise(function (resolve, reject) {
      api.require([name], function (val) {
        expect(getValue(name, val)).to.eql(name)
      })
      .then(resolve, reject)
    })
  }
})
