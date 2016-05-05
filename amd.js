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
      throw new Error('Module not loaded: ' + deps)
    }
    return fetchAll(deps).then(evaluate).catch(options.error)

    function evaluate (deps) {
      if (typeof cb !== 'function') return cb
      return cb.apply(null, deps || [])
    }
  }

  function def (name, deps, cb) {
    if (typeof name !== 'string') return anon.push(arguments)
    if (!cb) {
      cb = deps
      deps = []
    }
    deps = deps || []
    return localReq(deps, cb).then(register)

    function localReq (deps, cb) {
      if (typeof deps === 'string') return req(relativeTo(name, deps))
      return req(deps.map(localizeDep), cb)
    }

    function localizeDep (dep) {
      return dep === 'require'
      ? localReq
      : relativeTo(name, dep)
    }

    function register (m) {
      modules[name] = m
      if (waiting[name]) {
        waiting[name].resolve(m)
        delete waiting[name]
      }
    }
  }

  function fetch (name) {
    if (typeof name !== 'string') return name
    if (name in modules) return modules[name]
    if (waiting[name]) return waiting[name].promise
    waiting[name] = defer()
    setTimeout(function lookup () {
      if (name in modules) return
      loadScript(resolvePath(options.base, name) + '.js', function (err) {
        if (err) return waiting[name].reject(err)
        if (!(name in modules)) {
          if (anon.length) {
            var anonModule = anon.pop()
            return def(name, anonModule[0], anonModule[1])
          }
        }
      })
    }, 0)
    return waiting[name].promise
  }

  function fetchAll (deps) {
    return all(deps.map(fetch))
  }

  return { require: req, define: def }
}

function relativeTo (entryPoint, dep) {
  return dep.charAt(0) === '.'
    ? resolvePath(entryPoint.replace(/\/?[^\/]+$/, ''), dep)
    : dep
}
