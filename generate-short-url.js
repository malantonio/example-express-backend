module.exports = function generateShortUrl (length) {
  var alph = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  var alphLength = alph.length
  var out = ''
  var i = 0
  length = length || 6

  for (; i < length; i++) {
    var pos = Math.floor(Math.random() * alphLength)
    var letter = alph.substring(pos, pos + 1)
    out += letter
  }

  return out
}