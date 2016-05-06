module.exports = function map (arr, fn) {
  var mapped = []
  for (var i = 0; i < arr.length; i++) mapped[i] = fn(arr[i], i)
  return mapped
}
