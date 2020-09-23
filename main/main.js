const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');   
const path = require('path');
const generator = require('./generator');
 
let mainWindow;
 
function createWindow() {
    makeSingleInstance();
    mainWindow = new BrowserWindow({
        width:1280,
        height:720,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            // defaultFontFamily: 'sansSerif',
          }
    });
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
    console.log(startURL);
    mainWindow.loadURL(startURL);
    mainWindow.menuBarVisible = false;
    // Menu.setApplicationMenu(null)
    mainWindow.once('ready-to-show', () => mainWindow.show());
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    if (isDev) mainWindow.webContents.openDevTools();
    

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}


app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit()
  })

app.on('browser-window-created', () => {
    generator.init();
});


// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
    if (process.mas) return
  
    app.requestSingleInstanceLock()
  
    app.on('second-instance', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    })
  }