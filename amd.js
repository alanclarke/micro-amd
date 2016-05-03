var promise = require('sync-p')
var all = require('sync-p/all')
var loadScript = require('./lib/load-script')
var resolvePath = require('./lib/resolve-path')

module.exports = function (options) {
  var modules = {}
  var waiting = {}

  function require (deps, cb) {
    if (typeof deps === 'string') {
      if (!modules[deps]) throw new Error('not loaded: ' + deps)
      return modules[deps]
    }
    return all(deps.map(fetch)).then(function apply (args) {
      return cb ? cb.apply(null, args || []) : args
    })
  }

  function register (name, dependencies, cb) {
    return require(dependencies.map(relativeTo(name)), cb)
      .then(function resolveModule (m) {
        modules[name] = m
        if (waiting[name]) while (waiting[name].length) waiting[name].pop()(m)
      })
  }

  function fetch (name) {
    if (modules[name]) return modules[name]
    return promise(function (resolve, reject) {
      if (waiting[name]) return waiting[name].push(resolve)
      waiting[name] = [resolve]
      loadScript(resolvePath(options.base, name) + '.js')
    })
  }

  return { require: require, register: register }
}

function relativeTo (entry) {
  return function (dep) {
    return resolvePath(entry.replace(/\/?[^\/]+$/, ''), dep)
  }
}
