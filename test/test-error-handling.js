/* globals describe beforeEach afterEach it */
var expect = require('chai').expect
var amd = require('../index')

describe('error handling', function () {
  var api
  beforeEach(function () {
    api = amd({ base: '/base/test/fixtures/' })
    window.define = api.define
  })
  afterEach(function () {
    delete window.define
  })
  describe('promise', function () {
    describe('when the resource does not exist', function () {
      it('should reject promise', function (done) {
        return api.require(['i-dont-exist']).catch(function (err) {
          expect(err).not.to.eql(undefined)
          done()
        })
      })
    })
    describe('when the factory of a dependency errors', function () {
      it('should reject the promise', function (done) {
        return api.require(['throw']).catch(function (err) {
          expect(err).not.to.eql(undefined)
          done()
        })
      })
    })
    describe('when the callback passed to require errors', function () {
      it('should reject the promise', function (done) {
        return api.require([], function () {
          throw new Error('DERP!')
        })
        .catch(function (err) {
          expect(err).not.to.eql(undefined)
          done()
        })
      })
    })
    describe('when there is no callback passed to require', function () {
      it('should not throw', function () {
        return api.require([])
      })
    })
    describe('when there is no callback passed to define', function () {
      it('should not throw', function () {
        return api.define('undef', [])
      })
    })
    describe('when a syncronous define call errors', function () {
      it('should reject the promise', function (done) {
        return api.define('existentialism', [], function () {
          throw new Error('catch me if you can!')
        })
        .catch(function (err) {
          expect(err).not.to.eql(undefined)
          done()
        })
      })
    })
  })
  describe('non-promise', function () {
    describe('when the resource does not exist', function () {
      it('should reject promise', function (done) {
        return api.require(['i-dont-exist'], null, function (err) {
          expect(err).not.to.eql(undefined)
          done()
        })
      })
    })
    describe('when the factory of a dependency errors', function () {
      it('should reject the promise', function (done) {
        return api.require(['throw'], null, function (err) {
          expect(err).not.to.eql(undefined)
          done()
        })
      })
    })
    describe('when the callback passed to require errors', function () {
      it('should reject the promise', function (done) {
        return api.require([], function () {
          throw new Error('DERP!')
        }, function (err) {
          expect(err).not.to.eql(undefined)
          done()
        })
      })
    })
    describe('when there is no callback passed to require', function () {
      it('should not throw', function () {
        return api.require([])
      })
    })
    describe('when there is no callback passed to define', function () {
      it('should not throw', function () {
        return api.define('undef', [])
      })
    })
    describe('when a syncronous define call errors', function () {
      it('should reject the promise', function (done) {
        return api.define('existentialism', [], function () {
          throw new Error('catch me if you can!')
        }, function (err) {
          expect(err).not.to.eql(undefined)
          done()
        })
      })
    })
  })
})
