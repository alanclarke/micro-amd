/* globals describe it */
var expect = require('chai').expect
var resolvePath = require('../lib/resolve-path')

describe('resolve path', function () {
  it('should join bits with /', function () {
    expect(resolvePath('1', '2', '3')).to.eql('1/2/3')
  })
  it('should ignore undefined bits', function () {
    expect(resolvePath('1', undefined, '2')).to.eql('1/2')
    expect(resolvePath(undefined, '1', undefined)).to.eql('1')
    expect(resolvePath(undefined, '1', '2')).to.eql('1/2')
  })
  it('should ignore multiple /', function () {
    expect(resolvePath('1/', '//2/', '/3')).to.eql('1/2/3')
  })
  it('should handle ../', function () {
    expect(resolvePath('1', '2', '3/../4')).to.eql('1/2/4')
  })
  it('should handle ./', function () {
    expect(resolvePath('1', '2', '3/./4')).to.eql('1/2/3/4')
  })
  it('should blah', function () {
    expect(resolvePath('/base/test/fixtures', '4')).to.eql('/base/test/fixtures/4')
  })
})
