var promise = require('sync-p')
var all = require('sync-p/all')
var loadScript = require('./lib/load-script')
var resolvePath = require('./lib/resolve-path')

module.exports = function (options) {
  var modules = {}
  var waiting = {}

  function require (deps, cb) {
    deps = deps || []
    if (typeof deps === 'string') {
      if (!(deps in modules)) throw new Error('not loaded: ' + deps)
      return modules[deps]
    }
    return all(deps.map(fetch))
      .then(function apply (args) {
        return cb.apply(null, args || [])
      })
      .catch(options.error)
  }

  function register (name, deps, cb) {
    deps = deps || []
    return require(deps.map(relativeTo(name)), cb)
      .then(function resolveModule (m) {
        modules[name] = m
        if (waiting[name]) while (waiting[name].length) waiting[name].pop()(m)
      })
  }

  function fetch (name) {
    if (name in modules) return modules[name]
    return promise(function resolver (resolve, reject) {
      if (waiting[name]) return waiting[name].push(resolve)
      waiting[name] = [resolve]
      // defer external lookup as may not need it
      setTimeout(function lookup () {
        if (name in modules) return
        loadScript(resolvePath(options.base, name) + '.js')
      }, 0)
    })
  }

  return { require: require, register: register }
}

function relativeTo (entry) {
  return function (dep) {
    if (dep.charAt(0) !== '.') return dep
    return resolvePath(entry.replace(/\/?[^\/]+$/, ''), dep)
  }
}
