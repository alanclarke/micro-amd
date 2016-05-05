module.exports = function loadScript (url, cb) {
  var loaded
  var el = document.createElement('script')
  el.type = 'text/javascript'
  el.onload = el.onerror = el.onreadystatechange = function (err) {
    if (loaded) return
    if (/^loading/.test(el.readyState)) return
    if (el.readyState && !/^c|loade/.test(el.readyState)) return cb && cb(err.message)
    el.onload = el.onreadystatechange = null
    loaded = 1
    return cb && cb(null, 1)
  }
  el.async = 1
  el.src = url
  document.head.appendChild(el)
}
