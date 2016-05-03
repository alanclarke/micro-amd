/* globals describe beforeEach afterEach it */
var expect = require('chai').expect
var amd = require('../amd')

describe('micro-amd', function () {
  var api
  beforeEach(function () {
    api = amd({ base: '/base/test/fixtures' })
    window.register = api.register
  })
  afterEach(function () {
    delete window.register
  })

  it('should allow you to require a module', function (done) {
    api.require(['1'], function (one) {
      expect(one).to.eql(1)
      done()
    })
  })

  it('should allow you to require a module with dependencies', function (done) {
    api.require(['2'], function (two) {
      expect(two).to.eql(2)
      done()
    })
  })

  it('should allow you to require a module with nested dependencies', function (done) {
    api.require(['3'], function (three) {
      expect(three).to.eql(3)
      done()
    })
  })

  it('should allow you to require a module with relative dependencies', function (done) {
    api.require(['4'], function (four) {
      expect(four).to.eql(4)
      done()
    })
  })

  it('should allow you to require a module with deep relative nested dependencies', function (done) {
    api.require(['nested/a'], function (a) {
      expect(a).to.eql('b')
      done()
    })
  })

  it('should allow you to dynamically register arbitrary modules', function (done) {
    api.register('abc', [], function () {
      return 'abc'
    })
    api.require(['abc'], function (m) {
      expect(m).to.eql('abc')
      done()
    })
  })
  it('should allow syncronous requires of loaded modules', function () {
    api.register('abc', [], function abc () {
      return 'abc'
    })
    expect(api.require('abc')).to.eql('abc')
  })
})
