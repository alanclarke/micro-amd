/* globals describe beforeEach afterEach it */
var expect = require('chai').expect
var amd = require('../index')

describe('micro-amd', function () {
  var api

  beforeEach(function () {
    api = amd({ base: '/base/test/fixtures/' })
    window.define = api.define
  })

  afterEach(function () {
    delete window.define
  })

  it('should allow you to require a module', function () {
    return api.require(['1'], function (one) {
      expect(one).to.eql(1)
    })
  })

  it('should allow you to require a module with dependencies', function () {
    return api.require(['2'], function (two) {
      expect(two).to.eql(2)
    })
  })

  it('should allow you to require a module with nested dependencies', function () {
    return api.require(['3'], function (three) {
      expect(three).to.eql(3)
    })
  })

  it('should allow you to require a module with relative dependencies', function () {
    return api.require(['4'], function (four) {
      expect(four).to.eql(4)
    })
  })

  it('should allow you to require a module with deep relative nested dependencies', function () {
    return api.require(['nested/a'], function (a) {
      expect(a).to.eql('b')
    })
  })

  it('should allow you to dynamically register arbitrary modules', function () {
    api.define('abc', [], function () {
      return 'abc'
    })
    return api.require(['abc'], function (m) {
      expect(m).to.eql('abc')
    })
  })

  it('should allow syncronous requires of loaded modules', function () {
    api.define('abc', [], function abc () {
      return 'abc'
    })
    expect(api.require('abc')).to.eql('abc')
  })

  it('should allow local requires of loaded modules', function () {
    return api.require(['nested/c'], function (b) {
      expect(b).to.eql('b')
    })
  })

  it('should allow asyncronous requires of anonymous modules', function () {
    return api.require(['anon'], function (anon) {
      expect(anon).to.eql('anon1')
    })
  })

  it('should allow object literal syntax', function () {
    return api.require(['literal'], function (obj) {
      expect(obj.literal).to.eql(true)
    })
  })

  it('should allow modules that dont register', function () {
    return api.require(['non-registering'], function (m) {
      expect(m).to.eql(undefined)
      expect(window.nonRegistering).to.eql(true)
    })
  })

  it('should allow a medly of localized requires', function () {
    return api.require(['nested/d'], function (m) {
      expect(m).to.eql(3)
    })
  })

  it('should allow cjs', function () {
    return api.require(['cjs1', 'cjs2'], function (m1, m2) {
      expect(m1).to.eql({ value: 'cjs' })
      expect(m2).to.eql('cjs')
    })
  })
})
