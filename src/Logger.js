function type(o) {
    return Object.prototype.toString.call(o).replace(/^\[object |\]$/g, '')
}

export class Logger {
    constructor(el, maxKey) {
        this.el = el
        this.result = []
        this.maxKey = maxKey || 4
        this.maxRecursiveLevel = 4
        this.arrows = ['►', '▼']
        this.type = 'log'

        this.bindEvent()

    }
    bindEvent() {
        function findTarget(el, attr) {
            if (!el) return null
            if (el.location) return null

            if (el.hasAttribute(attr)) {
                return el
            } else {
                return findTarget(el.parentNode, attr)
            }
        }
        this.el.addEventListener('click', (e) => {
            const el = findTarget(e.target, 'data-trigger')

            if (el) {
                const nextEl = el.nextElementSibling

                if (nextEl && nextEl.nodeName === 'UL') {
                    if (nextEl.style.display === 'block') {
                        nextEl.style.display = 'none'
                        el.querySelector('ins').innerText = this.arrows[0]
                    } else {
                        nextEl.style.display = 'block'
                        el.querySelector('ins').innerText = this.arrows[1]
                    }
                }
            }
        })
    }
    log() {
        this.type = 'log'
        let args = Array.prototype.slice.call(arguments)
        if (args.length <= 1) {
            this.visit(args[0])
        } else {
            this.visit(args)
        }

        this.render()
    }
    error({msg, url, row, col, err}) {
        this.type = 'error'
        // let args = Array.prototype.slice.call(arguments)
        // if (args.length <= 1) {
        //     this.visit(args[0])
        // } else {
        //     this.visit(args)
        // }
        this.addResult(`<pre>${msg}</pre>`)
        this.render()
    }
    clear() {
        this.result = []
        this.render('')
    }
    isPrimitive(o) {
        return ['Boolean', 'Null', 'Undefined', 'Number', 'String' ].includes(type(o))
    }
    isFunction(o) {
        return ['Function' ].includes(type(o))
    }
    visit(o) {
        if (this.isPrimitive(o)) {
            this.renderPrimitive(o)
        } else {
            this.renderObject(o)
        }
    }
    valueToDOM(o, tag = 'span') {
        const t = type(o)

        const matchFnParams = str => {
            let match = str.match(/\([^()]+\)/)
            return match && match[0]
        }
        function escapeHtml(unsafe) {
            return unsafe
                 .replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
        }
        const str = t === 'String'
            ? `"${escapeHtml(o.replace(/\n/g, '↵'))}"`
            : t === 'Function'
                ? `<${tag} title="${o.toString()}">
                    ${this.keyToDOM('f')} ${escapeHtml(o.name+matchFnParams(o.toString()))}
                </${tag}>`
                : o
        return `<${tag} class="value type-${t.toLowerCase()}">${str}</${tag}>`
    }
    keyToDOM(key) {
        return `<span class="key ${key === 'f' ? 'fn':''}">${key}</span>`
    }
    renderPrimitive(o) {
        this.addResult(this.valueToDOM(o))
    }
    renderObject(o) {
        let result = []
        let MAX_LEVEL = this.maxRecursiveLevel
        let level = 0

        function traverse(obj) {
            if (level > MAX_LEVEL) return ''

            let html = '<ul>'
            if (this.isFunction(obj)) {
                html += `<li>${this.keyToDOM('f')}: ${this.valueToDOM(obj.toString())}</li>`
            } else {
                Object.keys(obj).forEach(item => {
                    if (this.isPrimitive(obj[item])) {
                        html += `<li>${this.keyToDOM(item)}: ${this.valueToDOM(obj[item])}</li>`
                    } else {
                        level++
                        html += `<li>
                            ${summary.call(this, obj[item], item)}
                            ${traverse.call(this, obj[item])}
                        </li>`
                        level--
                    }
                })
            }

            html += '</ul>'
            return html
        }
        function summary(o, key) {
            let result = []
            let MAX_KEY = this.maxKey
            let keys = Object.keys(o)

            if (this.isFunction(o)) {
                result.push(`${this.keyToDOM(key)}: ${this.valueToDOM(o)}`)
            } else {
                keys.slice(0, MAX_KEY).forEach(item => {
                    let keyStr = type(o) === 'Array'
                        ? ''
                        : `${this.keyToDOM(item)}: `
                    let summaryStr = type(o[item]) === 'Function'
                        ? this.keyToDOM('f') : '{…}'
                    if (this.isPrimitive(o[item])) {
                        result.push(`${keyStr} ${this.valueToDOM(o[item])}`)
                    } else {
                        result.push(`${keyStr} ${summaryStr}`)
                    }
                })
            }

            if (keys.length > MAX_KEY) { result.push('…') }

            let res = type(o) === 'Array'
                ? `<span class="len">(${o.length})</span>[${result.join(', ')}]`
                : `{${result.join(', ')}}`

            return `<a href="#none" data-trigger="1">
                <ins>${this.arrows[0]}</ins>${res}
            </a>`
        }

        this.addResult(summary.call(this, o) + traverse.call(this, o))
    }
    addResult(str) {
        return this.result.push(`<li class="logger-${this.type}">${str}</li>`)
    }
    render(text) {
        this.el.innerHTML = typeof text !== 'undefined'
            ? text
            : this.result.join('')
    }
}
