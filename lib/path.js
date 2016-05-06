module.exports = function resolve (base, path, local) {
  if (/^([^:/?#]+:)?\/\//.test(path)) return path
  if (local && path.charAt(0) !== '.') return path
  base = base.replace(/\/[^\/]+$/, '/')
  if (base.indexOf('/') === -1) base = ''
  return (base + path.replace(/^\//, ''))
    .replace(/[^\/]*\/[^\/]*\.\.\//g, '')
    .replace(/[^\/]*\.\//g, '')
}
