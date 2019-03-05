
function getHooks(type, endpoint) {
    return `\n<!--${type}_HOOKS_${endpoint}-->\n`.toUpperCase()
}
exports.getHooks = getHooks

function getHtmlTagNameAndAttr(type) {
    if (type === 'style') {
        return 'style'
    }
    if (type === 'script') {
        return 'script type="text/babel"'
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

function insertBabel(html, content) {
    const babeljs = content.startsWith('http')
        ? `<script src="${content}"></script>`
        : `<script>${content}</script>`

    const customeJS = `
    <script name="console-proxy">
        (function(root) {
            let rootConsole = root.console
            let log = root.console.log
            let error = root.console.error

            let parent = root.parent
            let hasLogger = parent && parent.logger

            root.console._log = function() { log.apply(rootConsole, arguments) }
            root.console._error = function() { error.apply(rootConsole, arguments) }

            if (hasLogger) {
                root.console.log = function() {
                    parent.logger.log.apply(parent.logger, arguments)
                }
                root.console.error = function() {
                    parent.logger.error.apply(parent.logger, arguments)
                }
                window.onerror = function(msg, url, row, col, err) {
                    parent.logger.error.call(parent.logger, {
                        msg, url, row, col, err
                    })
                }
            }
        })(this);
    </script>
    `
    return html.replace('</head>', `${customeJS}${babeljs}</head>`)
}
exports.insertBabel = insertBabel

function combineHTML(markup, style, script) {
    return insertScript(insertStyle(markup, style), script)
}
exports.combineHTML = combineHTML
