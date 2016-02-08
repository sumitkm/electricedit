/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="./services/settings/settings" />
import settingsService = require("./services/settings/settings");
import eventHandler = require('./event-handler');
import oAuth2 = require("./services/oauth2/oauth2");

var objectAssign = require('object-assign');

export class app {

    electron: GitHubElectron.Electron = require('electron');
    ipcMain: GitHubElectron.IPCMain = require('electron').ipcMain;
    currentApp = this.electron.app;  // Module to control application life.
    BrowserWindow = this.electron.BrowserWindow;  // Module to create native browser window.


    // Keep a global reference of the window object, if you don't, the window will
    // be closed automatically when the JavaScript object is garbage collected.
    mainWindow = null;
    settingsService = new settingsService();
    eventHandler = new eventHandler();

    constructor() {
        // Report crashes to our server.
        //electron.crashReporter.start({ companyName: "KalliopeXplorer"});
        console.log(oAuth2);

        this.settingsService.load();

        this.ipcMain.on('app.Settings.Load', (event, args) => {
            event.sender.send('app.Settings.Loaded', this.settingsService.get());
        });

        this.ipcMain.on('menu.App.Quit', (event, arg) => {
            this.quitApp();
        });

        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        this.currentApp.on('ready', this.initApp);
    }

    private initApp = () => {
        // Create the browser window.
        this.mainWindow = new this.BrowserWindow({ width: 1024, height: 768 });

        this.eventHandler.attach(this.mainWindow);
        // and load the index.html of the app.
        this.mainWindow.loadURL('file://' + __dirname + '/index.html');

        // Open the DevTools.
        //mainWindow.webContents.openDevTools();

        this.ipcMain.on('menu.View.ConnectWordPress', (event, arg) => {
            var appSettings = this.settingsService.currentSettings;

            const windowParams = {
                alwaysOnTop: true,
                autoHideMenuBar: true,
                nodeIntegration: false
            };
            var config = {
                clientId: appSettings.oAuth2Groups[0].oAuthClientId,
                clientSecret:  appSettings.oAuth2Groups[0].clientSecret,
                authorizationUrl: appSettings.oAuth2Groups[0].baseUrl + '/' + appSettings.oAuth2Groups[0].authorizeUrl,
                tokenUrl:  appSettings.oAuth2Groups[0].baseUrl + '/' +  appSettings.oAuth2Groups[0].tokenUrl,
                useBasicAuthorizationHeader: false,
                redirectUrl: appSettings.oAuth2Groups[0].redirectUrl
            };

            const options = {};

            const myAuthenticator = new oAuth2(config, windowParams);

            myAuthenticator.getAccessToken(options)
            .then(token => {
                objectAssign(appSettings.oAuth2Groups[0].clientSecret, { token });
                this.settingsService.save();
                console.log("token: " + JSON.stringify(token));
            });

        });

        // Emitted when the window is closed.
        this.mainWindow.on('closed', () => {
            this.quitApp();
        });


    }

    private quitApp = () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        //if (process.platform != 'darwin') {
        if (this.mainWindow != null) {
            this.eventHandler.detach();
            this.mainWindow = null;
        }
        //}
        //TODO: this is a bodge. Mac Apps don't quit when you close the window.
        // but until we can figure out how to handle ipc without any renderer
        // we'll have to keep quitting when the window is closed.
        // Not an issue in sane OSes like Linux ;-)
        this.settingsService.save();
        this.currentApp.quit();
    }
}

var electricEditorApp = new app();
