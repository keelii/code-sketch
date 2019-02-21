
function getHooks(type, endpoint) {
    return `\n<!--${type}_HOOKS_${endpoint}-->\n`.toUpperCase()
}
exports.getHooks = getHooks

function getHtmlTagNameAndAttr(type) {
    if (type === 'style') {
        return 'style'
    }
    if (type === 'script') {
        return 'script type="text/javascript"'
    }
}
exports.getHtmlTagNameAndAttr = getHtmlTagNameAndAttr

function insertStyle(html, css) {
    return html.replace('</head>', 
        `${getHooks('style', 'start')}<style>\n${css}\n</style>${getHooks('style', 'end')}</head>`)
}
exports.insertStyle = insertStyle 

function insertScript(html, js) {
    return html.replace('</body>', 
        `${getHooks('script', 'start')}<${getHtmlTagNameAndAttr('script')}>\n${js}\n</script>${getHooks('script', 'end')}</body>`)
}
exports.insertScript = insertScript 

function matchContent(html, type, dbg) {
    const startHook = getHooks(type, 'start')
    const endHook = getHooks(type, 'end')
    const start = html.match(startHook)
    const end = html.match(endHook)

    return html.substring(start.index, end.index + endHook.length)
}
exports.matchContent = matchContent 

function removeHook(html, type) {
    const startHook = getHooks(type, 'start')
    const endHook = getHooks(type, 'end')

    return html
        .replace(`${startHook}<${getHtmlTagNameAndAttr(type)}>\n`, '')
        .replace(`\n</${type}>${endHook}`, '')
}
exports.removeHook = removeHook 

function removeHooks(html, type) {
    return html.replace(matchContent(html, type), '')
}
exports.removeHooks = removeHooks 

function insertBabel(html) {
    const src = 'https://cdn.bootcss.com/babel-standalone/7.0.0-beta.3/babel.min.js'
    const babeljs = '<script src="'+ src +'"></script>'
    const customeJS = `
    <script name="console-proxy">
        // window.console.log = function(...args) {
        //     window.parent.log(...args)
        // }
    </script>
    `
    return html.includes(src)
        ? html
        : html.replace('</head>', `${babeljs}${customeJS}</head>`)
}
exports.insertBabel = insertBabel 

function combineHTML(markup, style, script) {
    return insertScript(insertStyle(markup, style), script)
}
exports.combineHTML = combineHTML 
