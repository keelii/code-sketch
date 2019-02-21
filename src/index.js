import React from 'react'
import ReactDOM from 'react-dom'
// import { h, render } from 'preact'

// import 'preact/debug'

import './index.scss'
import App from './App.js'

function ref(app) {
    window.app = app
}

ReactDOM.render(<App ref={ref} />, document.getElementById('app'))

// const titleCase = (txt) => {
//     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
// }
// class Editor {
//     constructor(name, content, idx) {
//         this.name = name
//         this.idx = idx
//         this.content = content
//         this.render()
//         this.initEditor()
//     }
//     render() {
//         this.el = document.createElement('div')
//         this.el.className = `cell ${this.name}`
//         this.el.innerHTML = this.getHTML()
//         document.querySelector('#app .container').appendChild(this.el)
//     }
//     getHTML() {
//         return `
//             <div class="top-bar">
//                 <strong>${titleCase(this.name)}</strong>
//                 <div class="action">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
//                 </div>
//             </div>
//             <div class="content" id=${this.name}>
//                 ${this.name === 'result' 
//                     ? `<webview id="webview" src="" nodeintegration="true"></webview>`
//                     : ''
//                 }
//             </div>`
//     }
//     initEditor() {
//         const modeMap = {
//             markup: 'htmlmixed',
//             style: 'css',
//             script: 'javascript'
//         }
//         this.editor = CodeMirror(document.querySelector(`#${this.name}`), {
//             value: this.content,
//             mode: modeMap[this.name],
//             keyMap: 'sublime',
//             dragDrop: false,
//             cursorBlinkRate: 1000,
//             // lineNumbers: true,
//             // viewportMargin: 'Infinity',
//             extraKeys: { 'Tab': 'emmetExpandAbbreviation' }
//         })
//         this.editor.on('change', () => {
//             this.editor.setSize("100%", "100%")
//         })
//     }
// }

// class App {
//     constructor(el, names) {
//         this.el = el

//         this.editors = this.initEditor(names)
//         this.split = this.initSplit(names)

//         this._meta_ = false
//         this.bindGlobalKeyMap()
//     }
//     toggle(idx) {}
//     toggleBar() {
//         let bars = this.el.querySelectorAll('.top-bar')
//         for (let bar of bars) {
//             bar.classList.toggle('toggle')
//         }
//     }
//     bindGlobalKeyMap() {
//         document.onkeydown = (e) => {
//             if (e.key === 'Meta') this._meta_ = true

//             if (e.metaKey) {
//                 if (e.key === '1') this.toggle(0)
//                 if (e.key === '2') this.toggle(1)
//                 if (e.key === '3') this.toggle(2)
//                 if (e.key === 'd') {
//                     e.stopPropagation()
//                     this.toggleBar()
//                 }
//             }
//         }
//         document.onkeyup = (e) => {
//             if (e.key === 'Meta') this._meta_ = false
//         }
//         document.onclick = (e) => {
//             if (this._meta_ && e.target.classList.contains('gutter')) {
//                 this.setEqual()
//             }
//         }
//         document.ondblclick = (e) => {
//             if (e.target.classList.contains('gutter')) {
//                 this.setEqual()
//             }
//         }
//     }
//     initSplit(names) {
//         return Split(names.map(n => `.${n}`), {
//             sizes: names.map(n => 100 / names.length),
//             minSize: 1,
//             gutterStyle: function () {
//                 return {
//                     'width': '5px'
//                 }
//             },
//             elementStyle: function(dimension, elementSize) {
//                 return {
//                     'width': `calc(${elementSize}% - 5px)`
//                 }
//             }
//         })
//     }
//     initEditor(names) {
//         return names.map((name, idx) => {
//             return new Editor(
//                 name,
//                 document.querySelector(`#${name}-textarea`).innerText,
//                 idx
//             )
//         })
//     }
// }

// window.app = new App(
//     document.getElementById('app'), 
//     ['markup', 'style', 'script']
// )

