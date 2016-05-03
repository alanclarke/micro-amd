module.exports = function loadScript (url, cb) {
  var loaded
  var el = document.createElement('script')
  el.onload = el.onerror = el.onreadystatechange = function () {
    if (loaded) return
    if (el.readyState && !/^c|loade/.test(el.readyState)) return cb && cb('error')
    el.onload = el.onreadystatechange = null
    loaded = 1
    return cb && cb(null, 1)
  }
  el.async = 1
  el.src = url
  document.head.appendChild(el)
}
