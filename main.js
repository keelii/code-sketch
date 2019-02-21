const fs = require('fs')
const url = require('url')
const path = require('path')
const { app, Menu, BrowserWindow, systemPreferences, ipcMain, dialog } = require('electron')
const { combineHTML, removeHooks, removeHook, matchContent } = require('./src/lib')

function getWin() {
    const focusedWin = BrowserWindow.getFocusedWindow()
    const allWins = BrowserWindow.getAllWindows()
    if (focusedWin) {
        return focusedWin
    } else if (allWins.length) {
        return allWins[0]
    } else {
        return null
    }
}
function getBounds(window) {
    const win = window || getWin()
    let bounds = {}
    if (win) {
        bounds = win.getBounds()
        bounds.x += 30
        bounds.y += 30
    }
    return bounds
}
function triggerEvent(win, event) {
    if (!win || !win.webContents) return

    if (event === 'reload') {
        win.reload()
    } else if (event === 'toggle_dev_tools') {
        win.webContents.toggleDevTools()
    } else {
        win.webContents.send(event)
    }
}

function initMenu(app) {
    var template = [{
        label: "Code Sketch",
        submenu: [{
            label: "About Code Sketch",
            selector: "orderFrontStandardAboutPanel:"
        }, {
            type: "separator"
        }, {
            label: "Quit",
            rale: "quit",
            accelerator: "Command+Q",
            click: function() { app.quit() }
        }]
    }, {
        label: "File",
        submenu: [{
            label: "New Window",
            accelerator: "CmdOrCtrl+N",
            click: function(item, focusedWindow) {
                createWindow(getBounds(focusedWindow))
            }
        }, {
            label: 'Save to',
            accelerator: 'CmdOrCtrl+Shift+s',
            click(item, focusedWindow) {
                triggerEvent(focusedWindow, 'SAVE_TO')
            }
        }, {
            label: 'Open',
            accelerator: 'CmdOrCtrl+o',
            click: function(item, focusedWindow) {
                if (BrowserWindow.getAllWindows().length < 1) {
                    createWindow({}, (win) => {
                        win.webContents.send('OPEN_FILE')
                    })
                } else {
                    triggerEvent(focusedWindow, 'OPEN_FILE')
                }
            }
        }, {
            label: 'Open Recent',
            role: 'recentdocuments',
            submenu: [
              {
                label: 'Clear Recent items',
                role: 'clearrecentdocuments'
              }
            ]
        }, {
            label: 'Close Window',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        }]
    }, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" }, 
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" }, 
            { type: "separator" }, 
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" }, 
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" }, 
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
    }, {
        role: 'window',
        submenu: [{ 
                role: 'togglefullscreen' 
            }, {
                label: 'Minimize',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            }, {
                type: "separator",
            }, {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click(item, focusedWindow) {
                    triggerEvent(focusedWindow, 'reload')
                }
            }, {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    triggerEvent(focusedWindow, 'toggle_dev_tools')
                }
            }
        ]
    }, {
        role: 'help',
        submenu: [
            {
                label: 'Donation',
                click (item, focusedWindow) {
                    const osTheme = getSystemTheme()
                    const query = { theme: osTheme }

                    let donateWin = new BrowserWindow({ 
                        width: 200, 
                        height: 250, 
                        resizable: false, 
                        minimizable: false, 
                        maximizable: false, 
                        alwaysOnTop: true,
                        fullscreenable: false,
                        fullscreen: false,
                        titleBarStyle: 'hidden'
                    })

                    donateWin.loadURL(url.format({
                        slashes: true,
                        protocol: 'file:',
                        pathname: path.resolve(app.getAppPath(), './donation.html'),
                        query
                    }))
                }
            }, {
            label: 'Documentation',
            click (item, focusedWindow) {
                createWindow(getBounds(focusedWindow), (win) => {
                    triggerEvent(win, 'LOAD_DEFAULT')
                })
            }
          }, 
        ]
    }]
    
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function getSystemTheme() {
    return systemPreferences.isDarkMode() ? 'dark' : 'light'
}
function createWindow({ width = 1000, height = 600, x, y}, callback) {
    const osTheme = getSystemTheme()

    // Create the browser window.
    mainWindow = new BrowserWindow({ width, height, x, y })

    const query = {
        theme: osTheme,
        app_path: app.getAppPath(),
        home_dir: app.getPath('home')
    }

    mainWindow.loadURL(process.env.ELECTRON_START_URL ? url.format({
        slashes: true,
        protocol: 'http:',
        hostname: 'localhost',
        port: 2044,
        query
    }) : url.format({
        slashes: true,
        protocol: 'file:',
        pathname: path.resolve(app.getAppPath(), './dist/index.html'),
        query
    }))

    mainWindow.setVibrancy(osTheme)
    systemPreferences.setAppLevelAppearance(osTheme)

    systemPreferences.subscribeNotification( 'AppleInterfaceThemeChangedNotification', () => {
        let osTheme = getSystemTheme()
        
        const wins = BrowserWindow.getAllWindows()
        if (wins) {
            wins.forEach(win => {
                win.setVibrancy(osTheme)
                systemPreferences.setAppLevelAppearance(osTheme)
                win.webContents.send('OS_THEME_CHANGE', osTheme)
            })
        }
    })

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    mainWindow.on('closed', function () {
        mainWindow = null
    })

    initMenu(app)

    mainWindow.webContents.once('dom-ready', () => {
        typeof callback === 'function' && callback(mainWindow)
    })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

// Open Recent file
app.on('open-file', function(event, filename) {
    const [markup, style, script] = parseFile(event, filename)
    
    createWindow(getBounds(), (win) => {
        win.send('load_file', markup, style, script)    
    })
})

function parseFile(event, filename) {
    try {
        const content = fs.readFileSync(filename, 'utf8')

        const markup = removeHooks(removeHooks(content, 'style'), 'script')
        const style = removeHook(matchContent(content, 'style', true), 'style')
        const script = removeHook(matchContent(content, 'script'), 'script')
    
        return [markup, style, script]        
    } catch (e) {
        event.sender.send('ON_ALERT', `Error to load file. ${e}`)
    }
}

ipcMain.on('LOAD_FILE', (event, filename) => {
    try {
        const [markup, style, script] = parseFile(event, filename)
        app.addRecentDocument(filename)
        event.sender.send('load_file', markup, style, script)            
    } catch (e) {
    }
})
ipcMain.on('SAVE_FILE', (event, filename, ...args) => {
    try {
        const html = combineHTML(...args)
        fs.writeFileSync(filename, html)
        app.addRecentDocument(filename)
        event.sender.send('ON_ALERT', 'File saved.')
    } catch (e) {
        event.sender.send('ON_ALERT', `File saved with error.\n ${e}`)
    }
})