export default {
    globals: {
        markup: {
            snippets: {
                'a': 'a[href="#none"]',
                'html': '!!!+(html[lang=${lang}]>(head>meta[charset=${charset}]+title{${1:Document}})+body)',
                'foo': 'div.foo[bar=baz]',
            }
        },
        stylesheet: {
            snippets: {
                myp: 'my-super: property'
            }
        }
        // ,
        // script: {
        //     snippets: {
        //         cl: 'console.log()'
        //     }
        // }
    }
}