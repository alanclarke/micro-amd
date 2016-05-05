module.exports = function resolve (base, path) {
  if (/^([^:/?#]+:)?\/\//.test(path)) return path
  base = base.replace(/\/[^\/]+$/, '/')
  if (base.indexOf('/') === -1) base = ''
  return (base + path.replace(/^\//, ''))
    .replace(/[^\/]*\/[^\/]*\.\.\//g, '')
    .replace(/[^\/]*\.\//g, '')
}
