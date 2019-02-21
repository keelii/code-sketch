export const markup = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Code Sketch</title>
</head>
<body>
    <h1>Code Sketch</h1>
    <hr>
    <blockquote>First place where the code was written...</blockquote>
	<hr>
    <h2>Features</h2>
    <ul>
        <li>Built-in Sass &amp; Babel support</li>
        <li>HTML/CSS <a href="https://docs.emmet.io/">emmet</a> support</li>
        <li>Easy import frontend-framework (via <a target="blank" href="https://www.bootcdn.cn/">bootcdn</a>).</li>
    </ul>
    <h2>Shortcuts</h2>
    <ul>
        <li><strong>Toggle Toolbar: </strong><kbd>Command</kbd>+<kbd>e</kbd></li>
        <li><strong>Font Size: </strong><kbd>Command</kbd>+<kbd>+/-</kbd></li>
        <li><strong>Save &amp; refresh: </strong><kbd>Command</kbd>+<kbd>s</kbd></li>
        <li><strong>Save to File: </strong><kbd>Command</kbd>+<kbd>shift</kbd>+<kbd>s</kbd></li>
        <li><strong>Import File: </strong><kbd>Command</kbd>+<kbd>o</kbd></li>
        <li><strong>Command Palette: </strong><kbd>Command</kbd>+<kbd>p</kbd></li>
    </ul>
    <h2>Donation</h2>
    <dl class="donate-img">
        <dt>
            <span class="wechat-btn curr" onclick="changeTo('wechat')">Wechat</span> / 
            <span class="alipay-btn " onclick="changeTo('alipay')">Alipay</span></dt>
        <dd>
            <img id="wechat-img" width="150" height="150" src="https://img20.360buyimg.com/devfe/jfs/t1/21276/10/6601/79942/5c612355Ebf90f7d4/59d92ca3cd5e85f8.png" alt="donate-wechat" />
            <img id="alipay-img" width="150" height="150" src="https://img10.360buyimg.com/devfe/jfs/t1/20408/25/6709/20132/5c612338E1e48641f/20cf08d4409c6a8e.png" alt="donate-alipay" />
        </dd>
    </dl>
</body>
</html>`

export const style = `@import url('https://fonts.googleapis.com/css?family=Crimson+Text');

h1, h2 { color: #333; font-weight: normal; }
h1 { margin-bottom: 5px; }
body {
    color: #666;
    font-family: 'Crimson Text', serif;

    li {
        margin-bottom: 5px;
        strong { display: inline-block; width: 9em; font-weight: normal; }
    }
    hr {
        border: none;
        height: 10px;
        background: url(https://img20.360buyimg.com/devfe/jfs/t27541/268/2256251402/92/22e21a5b/5bfcb0beN95c49f39.png) repeat-x left center;
    }
    blockquote {
        position: relative;
        padding-left: 30px;
        margin-left: 0;
        font-style: italic;
        &:before {
            content: "“";
            position: absolute;
            font-weight: normal;
            top: -15px;
            left: 0;
            font-size: 50px;
        }
    }
    kbd {
        display: inline-block;
        margin: 0 .1em;
        padding: .1em .6em;
        font-family: Arial,"Helvetica Neue",Helvetica,sans-serif;
        font-size: 11px;
        line-height: 1.4;
        color: #242729;
        text-shadow: 0 1px 0 #FFF;
        background-color: #eee;
        border: 1px solid #adb3b9;
        border-radius: 3px;
        box-shadow: 0 1px 0 rgba(12,13,14,0.2), 0 0 0 2px #FFF inset;
        white-space: nowrap;
    }    
}

.donate-img { text-align: center; font-size: 12px; }
.donate-img dt { margin-bottom: 10px; }
.donate-img dd { margin: 0; }
.donate-img dt span { cursor: pointer; }
.donate-img dt .curr { text-decoration: underline; cursor: default; }
#alipay-img { display: none;}`

export const script = `function changeTo(type) {
    document.querySelectorAll('.donate-img img').forEach(img => img.style.display = 'none')
    document.querySelector('#'+ type +'-img').style.display = 'inline'
    document.querySelectorAll('.donate-img dt span').forEach(span => span.classList.remove('curr'))
    document.querySelector('.'+ type +'-btn').classList.add('curr')
}`

export default {
    markup, style, script
}
// export default {
//     markup: '', style: '', script: ''
// }
