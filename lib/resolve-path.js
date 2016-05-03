module.exports = function resolvePath () {
  var arr = []
  var l = arguments.length
  for (var i = 0; i < l; i++) if (arguments[i]) arr.push(arguments[i])
  return arr
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/([^\/]+[\/]\.\.\/)|(\.\/)|(\/$)/g, '')
}
