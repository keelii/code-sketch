// import { h, render, Component } from 'preact'
import React, { Component } from 'react'

// import CommandPalette from '../../sublime-command-palette/dist/index'
import CommandPalette from '@code-sketch/sublime-command-palette'
import '@code-sketch/sublime-command-palette/dist/index.css'

import CodeMirror from 'codemirror'
import '../node_modules/codemirror/lib/codemirror.css'
// mode
import '../node_modules/codemirror/mode/javascript/javascript'
import '../node_modules/codemirror/mode/xml/xml'
import '../node_modules/codemirror/mode/htmlmixed/htmlmixed'
import '../node_modules/codemirror/mode/css/css'
import '../node_modules/codemirror/mode/sass/sass'
import '../node_modules/codemirror/mode/jsx/jsx'

import '../node_modules/codemirror/keymap/sublime'
import '../node_modules/codemirror/addon/hint/javascript-hint'
import '../node_modules/codemirror/addon/hint/html-hint'
import '../node_modules/codemirror/addon/hint/css-hint'
import '../node_modules/codemirror/addon/hint/xml-hint'
import '../node_modules/codemirror/addon/hint/anyword-hint'
import '../node_modules/codemirror/addon/search/search'
import '../node_modules/codemirror/addon/search/match-highlighter'
import '../node_modules/codemirror/addon/edit/closebrackets'
import '../node_modules/codemirror/addon/edit/closetag'
import '../node_modules/codemirror/addon/comment/comment'
import '../node_modules/codemirror/addon/comment/continuecomment'
import '../node_modules/codemirror/addon/tern/tern'

import '../node_modules/codemirror/addon/dialog/dialog'
import '../node_modules/codemirror/addon/dialog/dialog.css'

import '../node_modules/codemirror/addon/hint/show-hint'
// import '../node_modules/codemirror/addon/hint/show-hint.css'

import '../node_modules/codemirror/addon/fold/foldgutter'
import '../node_modules/codemirror/addon/fold/foldgutter.css'

import '../node_modules/codemirror/addon/fold/indent-fold'
import '../node_modules/codemirror/addon/fold/foldcode'
import '../node_modules/codemirror/addon/fold/xml-fold'


import emmet from '@emmetio/codemirror-plugin'

import Split from 'react-split'
import defaultValue from './default'

const sass = require('sass')

import emmetSnippet from './emmet'
import {Logger} from './Logger'

import './index.scss'

emmet(CodeMirror)

import { injectData, alias } from './library'
import {
    SplitPanelTitle,
    SplitPanelAction,
    SplitPanelHead,
    SplitPanelContent,
    SplitPanel
} from './components'

const { insertStyle, insertScript, insertBabel } = require('./lib')

const copy = (obj) => JSON.parse(JSON.stringify(obj))

const titleCase = (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
}

const LayoutToggler = ({direction, handleClick}) => {
    return (
        <div onClick={() => handleClick()}>
            {direction === 'horizontal' ?
                (
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                        <g> <path d="M6 42h4v-4H6v4zm4-28H6v4h4v-4zM6 34h4v-4H6v4zm8 8h4v-4h-4v4zM10 6H6v4h4V6zm8 0h-4v4h4V6zm16 0h-4v4h4V6zm-8 8h-4v4h4v-4zm0-8h-4v4h4V6zm12 28h4v-4h-4v4zm-16 8h4v-4h-4v4zM6 26h36v-4H6v4zM38 6v4h4V6h-4zm0 12h4v-4h-4v4zM22 34h4v-4h-4v4zm8 8h4v-4h-4v4zm8 0h4v-4h-4v4z"></path> </g>
                    </svg>
                )
                :
                (
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                        <g> <path d="M6 18h4v-4H6v4zm0-8h4V6H6v4zm8 32h4v-4h-4v4zm0-16h4v-4h-4v4zm-8 0h4v-4H6v4zm0 16h4v-4H6v4zm0-8h4v-4H6v4zm8-24h4V6h-4v4zm24 24h4v-4h-4v4zm-16 8h4V6h-4v36zm16 0h4v-4h-4v4zm0-16h4v-4h-4v4zm0-20v4h4V6h-4zm0 12h4v-4h-4v4zm-8-8h4V6h-4v4zm0 32h4v-4h-4v4zm0-16h4v-4h-4v4z"></path> </g>
                    </svg>
                )
            }
        </div>
    )
}

class Editor extends Component {
    render() {
        return (
            <div id={this.props.name} style={this.props.sizes}></div>
        )
    }

    initEditor() {
        const { name, mode, triggers, gutters } = this.props

        // const value = defaultValue[name]
        let value = window.localStorage.getItem(this.props.name) || ''
        const autoCloseTags = name === 'markup' ? true : false
        const theme = _query.theme || 'light'

        window[`editor_${this.props.name}`] = this.editor = CodeMirror(document.querySelector(`#${name}`), {
            value, mode,
            // theme: 'boxy-cm',
            theme: `cp-${theme}`,
            mime: 'text/x-scss',
            // foldCode: true,
            // styleActiveLine: { nonEmpty: true },
            dragDrop: true,
            continueLineComment: true,
            foldGutter: true,
            lineNumbers: false,
            // gutters: ["CodeMirror-foldgutter"],
            gutters,
            autoCloseTags,
            autoCloseBrackets: true,
            emmet: emmetSnippet,
            keyMap: "sublime",
            indentUnit: 4,
            extraKeys: {
                'Tab': 'emmetExpandAbbreviation',
                'Ctrl-Space': 'autocomplete'
            }
        })
        this.editor.on('change', () => {
            this.props.contentUpdate(this.props.name)
            window.localStorage.setItem(this.props.name, this.editor.getValue())
        })
        this.editor.on('keyup', (cm, event) => {
            if (!cm.state.completionActive && triggers.includes(event.key)) {
                CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
            }
        })
        this.editor.on('drop', (data, e) => {
            e.preventDefault()
            let paths = []
            for (let f of e.dataTransfer.files) {
                paths.push(f.path)
            }
            if (paths.length) {
                this.props.onDrop(paths)
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.active) {
            setTimeout(() => {
                this.editor.refresh()
                this.editor.focus()
            }, 10)
        }
    }
    componentWillUnmount() {
        this.editor.off('change')
        this.editor.off('keyup')
    }
    componentDidMount() {
        this.initEditor()
        this.editor.focus()
    }
    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps.sizes) != JSON.stringify(this.props.sizes)
    }
}

class Log extends Component {
    constructor(props) {
        super()
    }
    render() {
        return (
            <ul id="Logger" className="logs" style={this.props.sizes}>{/* test */}</ul>
        )
    }
    componentDidMount() {}
    shouldComponentUpdate() {
        return false
    }
}

class Iframe extends Component {
    render() {
        return (
            <div id="webview" style={this.props.sizes}></div>
        )
    }
    shouldComponentUpdate() {
        return false
    }
}

class App extends Component {
    static defaultProps = {
        fontSize: 14,
        sizes: [50, 50],
    }
    constructor(props) {
        super(props)

        const editors = [
            { name: 'markup', type: 'HTML', mode: 'htmlmixed', triggers: ['<', '='], keyMap: '1', title: '⌘ + 1' },
            { name: 'style', type: 'CSS', mode: 'text/x-scss', triggers: [':', ' '], keyMap: '2', title: '⌘ + 2' },
            { name: 'script', type: 'JavaScript', mode: 'jsx', triggers: ['.'], keyMap: '3', title: '⌘ + 3' },
        ]
        const results = [
            { name: 'view', keyMap: '4', title: '⌘ + 4' },
            { name: 'console', keyMap: '5', title: '⌘ + 5' },
        ]

        const gutters = []

        this.state = {
            zenMode: true,
            fontSize: 14,
            autoReload: true,
            activeEditor: { ...editors[0] },
            activeResult: { ...results[0] },
            direction: 'horizontal',
            // direction: 'vertical',
            logs: [],
            collapsed: 0,
            gutterSize: 5,
            sizes: [...props.sizes],
            editors, results, gutters
        }

        this.onDragEnd = this.onDragEnd.bind(this)
        this.resizeTimer = null
    }
    get bHeight() { return document.body.offsetHeight }
    get tHeight() { return document.querySelector('.top-bar').offsetHeight }
    get bWidth() { return document.body.offsetWidth }
    get tWidth() { return document.querySelector('.top-bar').offsetWidth }
    getSizes(type) {
        if (!document.querySelector('.top-bar')) return {}

        let [markup, result] = this.state.sizes
        if (this.state.direction === 'vertical') {
            if (type == 'markup') {
                return {
                    width: `${this.bWidth}px`,
                    height: `${this.bHeight * (markup / 100) - this.tHeight}px`
                }
            }
            if (type == 'result') {
                return {
                    width: `${this.bWidth}px`,
                    height: `${this.bHeight * (result / 100) - this.tHeight}px`
                }
            }
        }
        if (this.state.direction === 'horizontal') {
            if (type == 'markup') {
                return {
                    height: `${this.bHeight - this.tHeight}px`,
                    width: `${this.bWidth * (markup / 100)}px`
                }
            }
            if (type == 'result') {
                return {
                    height: `${this.bHeight - this.tHeight}px`,
                    width: `${this.bWidth * (result / 100)}px`
                }
            }
        }
    }
    onDragEnd(size) {
        this.setState(size)
    }
    render() {
        const { name, title } = this.state.activeEditor
        const activeResult = this.state.activeResult
        const autoReload = this.state.autoReload
        const direction = this.state.direction
        const gutterSize = this.state.gutterSize

        return [
            <style key="style" key={'style'}>{`
                body { --editor-font-size: ${this.state.fontSize}px; }
            `}</style>,
            <Split key="body" className={"container " + direction}
                gutterSize={gutterSize}
                onDragEnd={this.handleDragGutter.bind(this)}
                minSize={0}
                direction={direction}
                sizes={this.props.sizes}
            >
                <SplitPanel name={name} title={title}>
                    <SplitPanelHead className={'btns ' + (this.state.zenMode ? '':'toggle')}>
                        <div className="title">
                            <ul className="tabs">
                                {this.state.editors.map((e, idx) =>
                                    <li onClick={(evt) => this.setActiveEditor(e, evt)}
                                        key={e.name}
                                        className={name===e.name?'active':''}
                                        title={e.title}><span>{idx+1}</span>{titleCase(e.name)}</li>
                                )}
                            </ul>
                        </div>
                        <SplitPanelAction>
                            <LayoutToggler 
                                handleClick={this.handleLayoutToggerClick.bind(this)} 
                                direction={direction} />
                            {/*
                            <label htmlFor={`auto-reload-${name}`}>
                            <input type="checkbox"
                                onChange={(e) => this.setState({autoReload: e.target.checked})}
                                defaultChecked={autoReload}
                                id={`auto-reload-${name}`} /> Auto Reload</label>
                            */}
                        </SplitPanelAction>
                    </SplitPanelHead>
                    <SplitPanelContent>
                        {this.state.editors.map(e =>
                            <div className="panel-wrap" key={e.name} style={{display:name === e.name?'block':'none'}}>
                                <Editor {...e} key={e.name}
                                    active={name === e.name}
                                    onDrop={this.onDrop.bind(this)}
                                    zenMode={this.state.zenMode}
                                    gutters={this.state.gutters}
                                    sizes={this.getSizes('markup')}
                                    contentUpdate={this.processUpdate.bind(this)} />
                            </div>
                        )}
                    </SplitPanelContent>
                </SplitPanel>
                <SplitPanel name="result" title="result">
                    <SplitPanelHead className={'btns ' + (this.state.zenMode ? '':'toggle')}>
                        <div className="title">
                            <ul className="tabs">
                                {this.state.results.map((e, idx) =>
                                    <li onClick={() => this.setActiveResult(e)}
                                        key={e.name}
                                        className={activeResult.name===e.name?'active':''}
                                        title={e.title}><span>{idx+4}</span>{titleCase(e.name)}</li>
                                )}
                            </ul>
                        </div>
                        <SplitPanelAction></SplitPanelAction>
                    </SplitPanelHead>
                    <SplitPanelContent>
                        <div className="panel-wrap" style={{display:activeResult.name === 'view'?'flex':'none'}}>
                            <Iframe sizes={this.getSizes('result')} />
                        </div>
                        <div className="panel-wrap" style={{display:activeResult.name === 'console'?'flex':'none'}}>
                            <Log sizes={this.getSizes('result')} />
                        </div>
                    </SplitPanelContent>
                </SplitPanel>
            </Split>,
            <CommandPalette step={0}
                key="CommandPalette"
                async={injectData}
                done={this.done.bind(this)}
                alias={alias}
                aliasClick={this.aliasClick.bind(this)}
                data={[ [], [], [] ]}
            />
        ]
    }
    handleLayoutToggerClick() {
        document.querySelectorAll('.cell,.gutter').forEach(el => el.style = '')
        this.setState({
            sizes: [50, 50],
            direction: this.state.direction === 'horizontal' 
                ? 'vertical' 
                : 'horizontal'
        }, () => this.resizePanel())
    }
    handleDragGutter(sizes) {
        this.setState({ sizes: [...sizes] })
    }
    handleChange(name) {
        this.setActiveEditor(this.state.editors.find(d => d.name === name))
    }
    setActiveEditor(editor, e) {
        if (editor.name !== this.state.activeEditor.name) {
            // let activeResult = { ...this.state.results[0] }
            // if (e && e.metaKey) {
            //     if (editor.name === 'markup') {
            //         activeResult = { ...this.state.results[0] }
            //     }
            //     if (editor.name === 'script') {
            //         activeResult = { ...this.state.results[1] }
            //     }
            // }

            this.setState({
                activeEditor: {...editor},
                // activeResult
            })
        }
    }
    setActiveResult(result) {
        this.setState({ activeResult: {...result} })
    }
    toggleZenMode() {
        this.setState({
            zenMode: !this.state.zenMode
        }, () => {
            // if (!this.state.zenMode) {
            //     window.editor_markup.setOption('lineNumbers', false)
            //     window.editor_markup.setOption('gutters', [])
            // } else {
            //     window.editor_markup.setOption('lineNumbers', true)
            //     window.editor_markup.setOption('gutters', [...this.state.gutters])
            // }
        })
    }
    done(res) {
        const [name, version, file] = res.map(r => r.id)

        const url = `https://cdn.bootcss.com/${name}/${version}/${file}`
        const style = `<link rel="stylesheet" href="${url}" />\n`
        const script = `<script src="${url}"></script>\n`
        const html = /\.css$/.test(url) ? style : script

        this.insertText(window.editor_markup, html)
    }
    aliasClick({result}) {
        this.insertText(window.editor_markup, result)
    }
    insertText(editor, text) {
        var doc = editor.getDoc()
        var cursor = doc.getCursor()
        doc.replaceRange(text, cursor)
        editor.focus()
    }

    get APP_PATH() {
        return decodeURIComponent(window._query.app_path || '')
    }
    get HOME_PATH() {
        return decodeURIComponent(window._query.home_dir || '')
    }
    update() {
        if (!window.editor_markup) return

        let html = window.editor_markup.getValue()

        if (window.editor_style) {
            let data = window.editor_style.getValue()
            let res = {}

            try {
                res = sass.renderSync({ data, outputStyle: 'compressed' })
            } catch (err) {
                res.css = data
            }

            html = insertStyle(html, res.css)
        }
        if (window.editor_script) {
            let js = window.editor_script.getValue()
            html = insertScript(html, js)
        }

        if (true) {
            let content = ''
            if (window.require) {
                let fs = window.require('fs')
                content = fs.readFileSync(`${decodeURIComponent(_query.app_path)}/lib/babel.min.js`, 'utf8')
            } else {
                content = 'https://unpkg.com/@babel/standalone@7.3.4/babel.min.js'
            }
            
            html = insertBabel(html, content)
        }

        this.logger.clear()

        let doc = this.getIframe().contentDocument
        if (doc.open) {
            try {
                doc.open()
                doc.write(html)
                doc.close()    
            } catch (error) {
                console.log(error)
            }
        }
    }
    getIframe() {
        const webview = document.getElementById('webview')
        let oldIframe = webview.childNodes[0]

        if (oldIframe) oldIframe.parentElement.removeChild(oldIframe)

        let iframe = document.createElement('iframe')
        webview.appendChild(iframe)
        return iframe
    }
    processUpdate(name) {
        // if (name !== 'script' && this.state.autoReload) {
        //     clearTimeout(this.timer)
        //     this.timer = setTimeout(this.update.bind(this), 200)
        // }
    }
    equalGutterWidth() {
        this.setState({
            sizes: [50, 50]
        })
    }
    handleDbClick(e) {
        if (e.target && e.target.classList && e.target.classList.contains('gutter')) {
            this.equalGutterWidth()
        }
    }
    onDrop(paths) {
        this.ipc.send('LOAD_FILE', paths[0])
    }
    bindKeyMap() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this))
        document.addEventListener('dblclick', this.handleDbClick.bind(this))
    }
    unbindKeyMap() {
        document.removeEventListener('keydown', this.handleKeyDown.bind(this))
        document.removeEventListener('dblclick', this.handleDbClick.bind(this))
    }
    handleKeyDown(e) {
        if (e.metaKey) {
            this.state.editors.map(editor => {
                if (e.key === editor.keyMap) {
                    this.stopPrevent(e)
                    this.setActiveEditor(editor)
                }
            })
            this.state.results.map(result => {
                if (e.key === result.keyMap) {
                    this.stopPrevent(e)
                    this.setActiveResult(result)
                }
            })

            if (e.key === 'e') {
                this.stopPrevent(e)
                this.toggleZenMode()
            }

            if (e.key === '0') {
                this.changeFontSize('def')
                this.stopPrevent(e)
            }
            if (e.key === '=') {
                this.changeFontSize('inc')
                this.stopPrevent(e)
            }
            if (e.key === '-') {
                this.changeFontSize('dec')
                this.stopPrevent(e)
            }

            if (e.key === 'o') {
                this.stopPrevent(e)
                this.openDialog()
            }
            if (e.key === 's') {
                if (e.shiftKey) {
                    this.saveDialog()
                } else {
                    this.update()
                }
                this.stopPrevent(e)
            }
        }
    }
    saveDialog() {
        const {dialog} = window.require('electron').remote
        const defaultPath = this.HOME_PATH + '/Desktop/unname.html'

        dialog.showSaveDialog({
            title: 'save',
            defaultPath
        }, (filename) => {
            const markup = window.editor_markup.getValue()
            const style = window.editor_style.getValue()
            const script = window.editor_script.getValue()

            this.ipc.send('SAVE_FILE', filename, markup, style, script)
        })
    }
    get ipc() {
        if (window.require) {
            return window.require('electron').ipcRenderer
        } else {
            return { on() {}, send() {}, sendToHost() {} }
        }
    }
    openDialog() {
        const {dialog} = window.require('electron').remote
        dialog.showOpenDialog({
            title: 'open',
            openFile: true,
        }, (filePaths) => {
            if (!filePaths) return
            if (filePaths.length > 0) {
                if (!/\.html?$/.test(filePaths[0])) return alert('只能打开 HTML 格式文件')

                this.ipc.send('LOAD_FILE', filePaths[0])
            }
        })
    }
    loadFile(event, markup, style, script) {
        window.editor_markup.setValue(markup)
        window.editor_style.setValue(style)
        window.editor_script.setValue(script)

        this.update()
    }
    changeFontSize(type) {
        let fontSize = this.state.fontSize
        if (type === 'inc') fontSize += 2
        if (type === 'dec') fontSize -= 2
        if (type === 'def') fontSize = this.props.fontSize

        if (fontSize > 50 || fontSize < 12) return false

        this.setState({ fontSize }, () => {
            this.state.editors.forEach(editor => {
                if (window[`editor_${editor.name}`]) {
                    window[`editor_${editor.name}`].refresh()
                }
            })
        })
    }
    stopPrevent(e) {
        e.stopPropagation()
        e.preventDefault()
    }
    get ipc() {
        if (window.require) {
            return window.require('electron').ipcRenderer
        } else {
            return { on() {}, send() {}, sendToHost() {} }
        }
    }
    loadDefault() {
        const {markup, style, script} = require('./default')
        this.loadFile(null, markup, style, script)
    }
    alert(event, msg) {
        console.log(msg)
    }
    handleChangeTheme(event, s) {
        document.body.classList.remove('dark')
        document.body.classList.remove('light')
        document.body.classList.add(s)
        window.editor_markup.setOption('theme', `cp-${s}`)
        window.editor_style.setOption('theme', `cp-${s}`)
        window.editor_script.setOption('theme', `cp-${s}`)
    }
    listenIPC() {
        this.ipc.on('OPEN_FILE', this.openDialog.bind(this))
        this.ipc.on('LOAD_DEFAULT', this.loadDefault.bind(this))
        this.ipc.on('load_file', this.loadFile.bind(this))
        this.ipc.on('ON_ALERT', this.alert.bind(this))
        this.ipc.on('SAVE_TO', this.saveDialog.bind(this))
        this.ipc.on('OS_THEME_CHANGE', this.handleChangeTheme.bind(this))
    }
    resizePanel() {
        clearTimeout(this.resizeTimer)
        this.resizeTimer = setTimeout(() => {
            this.setState({ 
                sizes: this.state.sizes
            })
        }, 300)
    }
    bindResize() {
        window.addEventListener('resize', this.resizePanel.bind(this))
    }
    unbindResize() {
        window.removeEventListener('resize', this.resizePanel.bind(this))
    }
    componentWillUnmount() {
        this.unbindKeyMap()
        this.unbindResize()
    }
    componentDidMount() {
        this.listenIPC()
        this.bindKeyMap()
        this.bindResize()

        this.setState({ sizes: this.state.sizes })

        // this.resizePanel()

        // setTimeout(() => {
        //     this.update()
        // }, 500)

        this.logger = window.logger = new Logger(
            document.querySelector('#Logger')
        )
    }
}
export default App
