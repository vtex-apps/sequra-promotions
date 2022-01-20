/* eslint-disable */
// @ts-nocheck

export const buildSequraScript = (sequraConfigParams): string => {
  return (function (i, s, o, g, r, a, m) {
    i['SequraConfiguration'] = g
    i['SequraOnLoad'] = []
    i[r] = {}
    i[r][a] = function (callback) {
      i['SequraOnLoad'].push(callback)
    }
    // eslint-disable-next-line padding-line-between-statements
    ;(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0])
    a.async = 1
    a.src = g.scriptUri
    a.id = 'SeQura'
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', sequraConfigParams, 'Sequra', 'onLoad')
}
