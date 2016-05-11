module.exports = function resolve (base, path, local) {
  if (!local) path = path.replace(/(?:\.js)?(\?|#|$)/, '.js$1')
  if (/^(([^:/?#]+:)?\/)?\//.test(path)) return path // ignore base if path has protocol
  if (local && path.charAt(0) !== '.') return path // ignore base if local and path is relative
  base = base.replace(/\/[^\/]+$/, '/')  // ignore trailing files
  if (base.indexOf('/') === -1) base = '' // ignore trailing files
  return (base + path)
    .replace(/[^\/]*\/[^\/]*\.\.\//g, '') // resolve ../
    .replace(/[^\/]*\.\//g, '') // resolve ./
}
