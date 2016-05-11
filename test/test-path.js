/* globals describe it */
var expect = require('chai').expect
var path = require('../lib/path')

describe('path', function () {
  it('should ignore the base if entry has a protocol', function () {
    expect(path('a/', '//b')).to.eql('//b.js')
    expect(path('a/', 'http://b')).to.eql('http://b.js')
    expect(path('a/', 'https://b')).to.eql('https://b.js')
  })

  it('should ignore the base if entry has a leading slash', function () {
    expect(path('a/', '/b')).to.eql('/b.js')
  })

  it('should ignore trailing files', function () {
    expect(path('a/b', 'c')).to.eql('a/c.js')
    expect(path('a', 'b')).to.eql('b.js')
  })

  it('should join base and entry', function () {
    expect(path('a/', 'b')).to.eql('a/b.js')
  })

  it('should handle ./', function () {
    expect(path('a/b', './c')).to.eql('a/c.js')
    expect(path('a/', './c')).to.eql('a/c.js')
    expect(path('a', './c')).to.eql('c.js')
  })

  it('should handle ../', function () {
    expect(path('a/b/c', '../d')).to.eql('a/d.js')
    expect(path('a/b/', '../d')).to.eql('a/d.js')
    expect(path('a/b', '../d')).to.eql('d.js')
  })

  it('should add .js if omitted', function () {
    expect(path('a/b', 'd')).to.eql('a/d.js')
  })

  it('should not add .js if already present', function () {
    expect(path('a/b', 'd.js')).to.eql('a/d.js')
  })

  it('should add .js to the right place despite querystring and hash', function () {
    expect(path('a/b', 'd?a=b')).to.eql('a/d.js?a=b')
    expect(path('a/b', 'd#a=b')).to.eql('a/d.js#a=b')
    expect(path('a/b', 'd?a=b#a=b')).to.eql('a/d.js?a=b#a=b')
  })

  describe('local', function () {
    it('should ignore the base if entry file is not relative', function () {
      expect(path('a/b', 'c', true)).to.eql('c')
    })
    it('should behave the same otherwise', function () {
      expect(path('a/b', './c', true)).to.eql('a/c')
    })
  })
})
