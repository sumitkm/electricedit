/// <reference path="../typings/tsd.d.ts"/>

var electr0n = require('electron');
var ipcmain = require('electron').ipcMain;
var nconf = require('nconf');
var fs = require('fs');
// var menus = require('./services/menus/menus.js');
// var ipcrenderer = require('electron').ipcRenderer;
// var ipcdialog = require('electron').dialog;

const fileService = require("./services/files/files.js");
const settingsSvc = require("./services/settings/settings.js");
const currentApp = electr0n.app;  // Module to control application life.
const BrowserWindow = electr0n.BrowserWindow;  // Module to create native browser window.

// Report crashes to our server.
//electron.crashReporter.start({ companyName: "KalliopeXplorer"});


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var settingsService = new settingsSvc.settings();

settingsService.load();

// Quit when all windows are closed.
currentApp.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        currentApp.quit();
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


    ipcmain.on('app.Settings.Load', (event, args) => {
            event.sender.send('app.Settings.Loaded', settingsService.get());
    });

var selfie = this;
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
currentApp.on('ready', () => {

    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 1024, height: 768 });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    ipcmain.on("menu.File.New", (event, arg) => {
        var files = new fileService.Files(mainWindow);
        files.New();
    });

    ipcmain.on("menu.File.Open", (event, arg) => {
        var files = new fileService.Files(mainWindow);
        files.Open(event);
    });

    ipcmain.on("app.File.Load", (event, arg) => {
        var files = new fileService.Files(mainWindow);
        files.Load(event, [arg]);
    });

    ipcmain.on("menu.File.OnSave", (event, arg) => {
        event.sender.send("menu.File.Save");
    });

    ipcmain.on("menu.View.OnSettings", (event, arg) => {
        event.sender.send("menu.View.Settings", nconf);
    });

    ipcmain.on("app.File.Save", (event, arg) => {
        var files = new fileService.Files(mainWindow);
        if (arg.fileName != '') {
            console.log("Adding to nConf" + arg.fileName);
            settingsService.set('lastOpenFile', arg.fileName );
        }
        files.Save(event, arg);
    });

    ipcmain.on('menu.App.Quit', (event, arg) => {
        quitApp();
    });

    ipcmain.on('settings.App.Save', (event, arg) =>{
        settingsService.saveSettings(arg);
    })
    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        quitApp();
    });


    var quitApp = () =>
    {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        //if (process.platform != 'darwin') {
        if (mainWindow != null) {
            mainWindow = null;
        }
        //}
        //TODO: this is a bodge. Mac Apps don't quit when you close the window.
        // but until we can figure out how to handle ipc without any renderer
        // we'll have to keep quitting when the window is closed.
        // Not an issue in sane OSes like Linux ;-)
        settingsService.save();
        currentApp.quit();
    }
});
