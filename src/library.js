export const fetchData = (url) => {
    const cacheData = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
        return data
    }
    if (localStorage.getItem(url)) {
        return Promise.resolve(JSON.parse(localStorage.getItem(url)))
    } else {
        return fetch(url)
            .then(res => res.json())
            .then(data => cacheData(url, data))
    }
}
export const processLibraryData = (items) => {
    return items.map(([title, desc, meta]) => {
        return { id: title, title, desc, meta }
    })
}
export const processLibraryItemData = (d) => {
    return d.assets.map(({version, files}) => {
        return { id: version, title: version }
    })
}
export const injectData = (step, item, results, cb) => {
    const API = 'https://api.bootcdn.cn/libraries'

    if (step === 0) {
        fetchData(`${API}.min.json`)
            .then(processLibraryData)
            .then(cb)
    } else if (step === 1) {
        fetchData(`${API}/${item.id}.json`)
            .then(processLibraryItemData)
            .then(cb)
    } else if (step === 2) {
        const paths = results.filter(d => d !== null).map(d => d.id)
        const lib = JSON.parse(localStorage.getItem(`${API}/${paths[0]}.json`))

        const items = lib.assets
            .find(({version}) => version === paths[1])
            .files.map(file => {
                return { id: file, title: file }
            })
        cb(items)
    }
}

export const alias = [
    { name: 'React', result: '<script src="https://cdn.bootcss.com/react/16.4.0/umd/react.production.min.js"></script>\n    <script src="https://cdn.bootcss.com/react-dom/16.4.0/umd/react-dom.production.min.js"></script>' },
    { name: 'Vue', result: '<script src="https://cdn.bootcss.com/vue/2.5.16/vue.js"></script>' },
    { name: 'jQuery', result: '<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.js"></script>' },
    { name: 'Bootstrap', result: '<link rel="stylesheet" href="https://cdn.bootcss.com/twitter-bootstrap/4.1.1/css/bootstrap.css">\n    <script src="https://cdn.bootcss.com/twitter-bootstrap/4.1.1/js/bootstrap.js"></script>' },
    { name: 'Semantic-ui', result: '<link rel="stylesheet" href="https://cdn.bootcss.com/semantic-ui/2.3.1/semantic.css">\n    <script src="https://cdn.bootcss.com/semantic-ui/2.3.1/semantic.js"></script>' },
]