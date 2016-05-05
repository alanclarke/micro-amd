/* globals describe it */
var expect = require('chai').expect
var path = require('../lib/path')

describe('path', function () {
  describe('resolve', function () {
    it('should ignore the base if entry has a protocol', function () {
      expect(path('a/', '//b')).to.eql('//b')
      expect(path('a/', 'http://b')).to.eql('http://b')
      expect(path('a/', 'https://b')).to.eql('https://b')
    })

    it('should ignore trailing files', function () {
      expect(path('a/b', 'c')).to.eql('a/c')
      expect(path('a', 'b')).to.eql('b')
    })

    it('should join base and entry', function () {
      expect(path('a/', 'b')).to.eql('a/b')
    })

    it('should not double slash', function () {
      expect(path('a/', '/b')).to.eql('a/b')
    })

    it('should handle ./', function () {
      expect(path('a/b', './c')).to.eql('a/c')
      expect(path('a/', './c')).to.eql('a/c')
      expect(path('a', './c')).to.eql('c')
    })

    it('should handle ../', function () {
      expect(path('a/b/c', '../d')).to.eql('a/d')
      expect(path('a/b/', '../d')).to.eql('a/d')
      expect(path('a/b', '../d')).to.eql('d')
    })
  })
})
