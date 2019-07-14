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