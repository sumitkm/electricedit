/// <reference path="../typings/tsd.d.ts"/>

const electron = require('electron');
var ipcmain = require('electron').ipcMain;
// var ipcrenderer = require('electron').ipcRenderer;
// var ipcdialog = require('electron').dialog;

const servives = require("./services/files/files.js");

const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

// Report crashes to our server.
//electron.crashReporter.start({ companyName: "KalliopeXplorer"});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// const ipcMain = require('electron').ipcMain;
ipcmain.on('asynchronous-message', function(event, arg) {
  console.log(arg);  // prints "ping"
  event.sender.send('asynchronous-reply', 'Initialized asynchronous Interop');
});

ipcmain.on('synchronous-message', function(event, arg) {
  console.log(arg);  // prints "ping"
  event.returnValue = 'Initialized synchronous Interop';
});

var selfie = this;
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {

  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1024, height: 768 });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  ipcmain.on("save", (event, arg) => {
    var files = new servives.Files(mainWindow);
    files.Save(arg);
  });
  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
