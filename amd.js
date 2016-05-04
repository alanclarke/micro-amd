var all = require('sync-p/all')
var defer = require('sync-p/defer')
var loadScript = require('./lib/load-script')
var resolvePath = require('./lib/resolve-path')

module.exports = function (options) {
  var modules = {}
  var waiting = {}
  var anon = []

  function req (deps, cb) {
    deps = deps || []
    if (typeof deps === 'string') {
      if (deps in modules) return modules[deps]
      throw new Error('not loaded: ' + deps)
    }
    return all(deps.map(fetch))
      .then(function apply (args) {
        return cb.apply(null, args || [])
      })
      .catch(options.error)
  }

  function def (name, deps, cb) {
    if (typeof name !== 'string') return anon.push(arguments)
    if (!cb) {
      cb = deps
      deps = []
    }
    deps = deps || []
    return req(deps.map(relativeTo(name)), cb)
      .then(function resolveModule (m) {
        modules[name] = m
        if (waiting[name]) {
          waiting[name].resolve(m)
          delete waiting[name]
        }
      })
  }

  function fetch (name) {
    if (name in modules) return modules[name]
    if (waiting[name]) return waiting[name].promise
    waiting[name] = defer()
    setTimeout(function lookup () {
      if (name in modules) return
      loadScript(resolvePath(options.base, name) + '.js', function (err) {
        if (err) return waiting[name].reject(err)
        if (!(name in modules) && anon.length) {
          var anonModule = anon.pop()
          return def(name, anonModule[0], anonModule[1])
        }
      })
    }, 0)
    return waiting[name].promise
  }

  return { require: req, define: def }
}

function relativeTo (entry) {
  return function (dep) {
    if (dep.charAt(0) !== '.') return dep
    return resolvePath(entry.replace(/\/?[^\/]+$/, ''), dep)
  }
}
