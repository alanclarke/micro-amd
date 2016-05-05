var promise = require('sync-p')
var all = require('sync-p/all')
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
    waiting[name] = reqLocal(deps, cb).then(register)
    return waiting[name]

    function reqLocal (deps, cb) {
      if (typeof deps === 'string') return req(relativeTo(name, deps))
      return req(deps.map(localizeDep), cb)
    }

    function localizeDep (dep) {
      return dep === 'require'
      ? reqLocal
      : relativeTo(name, dep)
    }

    function register (m) {
      modules[name] = m
      delete waiting[name]
      return m
    }
  }

  function fetch (name) {
    if (typeof name !== 'string') return name
    if (name in modules) return modules[name]
    if (waiting[name]) return waiting[name]
    // need to fetch
    return promise(function (resolve, reject) {
      setTimeout(function lookup () {
        if (name in modules) return resolve(modules[name])
        if (waiting[name]) return resolve(waiting[name])
        loadScript(resolvePath(options.base, name) + '.js', function (err) {
          if (err) return reject(err)
          if (name in modules) return resolve(modules[name])
          if (waiting[name]) return resolve(waiting[name])
          if (anon.length) {
            var anonModule = anon.pop()
            return resolve(def(name, anonModule[0], anonModule[1]))
          }
          return resolve(def(name))
        })
      }, 0)
    })
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
