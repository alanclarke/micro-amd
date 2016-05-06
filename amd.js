var promise = require('sync-p')
var all = require('sync-p/all')
var fetchJs = require('fetch-js')
var path = require('./lib/path')
var map = require('./lib/map')

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
    return all(map(deps, fetch)).then(evaluate).catch(options.error)

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
    waiting[name] = reqLocal(deps, cb).then(register)
    return waiting[name]

    function reqLocal (deps, cb) {
      if (typeof deps === 'string') return req(path(name, deps, true))
      return req(map(deps, localizeDep), cb)
    }

    function localizeDep (dep) {
      return dep === 'require'
        ? reqLocal
        : path(name, dep, true)
    }

    function register (m) {
      modules[name] = m
      delete waiting[name]
      return m
    }
  }

  function fetch (name) {
    return promise(function (resolve, reject) {
      if (typeof name !== 'string') return resolve(name)
      if (waiting[name] || name in modules) return resolve(waiting[name] || modules[name])
      setTimeout(function lookup () {
        if (waiting[name] || name in modules) return resolve(waiting[name] || modules[name])
        fetchJs(path(options.base, name) + '.js', function (err) {
          if (err) return reject(err)
          if (waiting[name] || name in modules) return resolve(waiting[name] || modules[name])
          if (anon.length) {
            var anonModule = anon.pop()
            return resolve(def(name, anonModule[0], anonModule[1]))
          }
          return resolve(def(name))
        })
      }, 0)
    })
  }

  return { require: req, define: def }
}
