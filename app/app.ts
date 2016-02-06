/// <reference path="../typings/tsd.d.ts"/>

export class app {
    
    electron : GitHubElectron.Electron = require('electron');
    ipcMain : GitHubElectron.IPCMain = require('electron').ipcMain;
    currentApp = this.electron.app;  // Module to control application life.
    BrowserWindow = this.electron.BrowserWindow;  // Module to create native browser window.

    events = require('./event-handler.js');
    fileService = require("./services/files/files.js");
    settingsSvc = require("./services/settings/settings.js");

    constructor() {
        // Report crashes to our server.
        //electron.crashReporter.start({ companyName: "KalliopeXplorer"});

        // Keep a global reference of the window object, if you don't, the window will
        // be closed automatically when the JavaScript object is garbage collected.
        var mainWindow = null;
        var settingsService = new this.settingsSvc.settings();
        var eventHandler = new this.events.eventHandler();

        settingsService.load();

        this.ipcMain.on('app.Settings.Load', (event, args) => {
            event.sender.send('app.Settings.Loaded', settingsService.get());
        });

        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        this.currentApp.on('ready', () => {

            // Create the browser window.
            mainWindow = new this.BrowserWindow({ width: 1024, height: 768 });

            eventHandler.attach(mainWindow);
            // and load the index.html of the app.
            mainWindow.loadURL('file://' + __dirname + '/index.html');

            // Open the DevTools.
            //mainWindow.webContents.openDevTools();

            // Emitted when the window is closed.
            mainWindow.on('closed', () => {
                quitApp();
            });

            this.ipcMain.on('menu.App.Quit', (event, arg) => {
                quitApp();
            });

            var quitApp = () => {
                // Dereference the window object, usually you would store windows
                // in an array if your app supports multi windows, this is the time
                // when you should delete the corresponding element.
                //if (process.platform != 'darwin') {
                if (mainWindow != null) {
                    eventHandler.detach();
                    mainWindow = null;
                }
                //}
                //TODO: this is a bodge. Mac Apps don't quit when you close the window.
                // but until we can figure out how to handle ipc without any renderer
                // we'll have to keep quitting when the window is closed.
                // Not an issue in sane OSes like Linux ;-)
                settingsService.save();
                this.currentApp.quit();
            }
        });
    }
}

var electricEditorApp = new app();
