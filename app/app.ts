/// <reference path="./typings/index.d.ts"/>

import * as wordpress  from "./services/wordpress/service";
import * as settings from "./services/settings/service";
import * as files  from "./services/files/service";
import * as electron from "electron";
import { EventHandler } from './event-handler';
import { oAuth2 } from "./services/oauth2/oauth2";


export class app {
    currentApp :Electron.App = electron.app;  // Module to control application life.
    BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
    // Keep a global reference of the window object, if you don't, the window will
    // be closed automatically when the JavaScript object is garbage collected.
    mainWindow : Electron.BrowserWindow = null;

    ipcMain: Electron.IpcMain = require('electron').ipcMain;
    settingsService = new settings.Service(this.currentApp);
    eventHandler = new EventHandler(this.currentApp);
    currentAppSettings: settings.model.appSettings;

    constructor() {
        // Report crashes to our server.
        //electron.crashReporter.start({ companyName: "KalliopeXplorer"});
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
        this.mainWindow.loadURL('file://' + __dirname + '/ui/index.html');

        // Open the DevTools.
        //mainWindow.webContents.openDevTools();

        this.ipcMain.on('menu.View.ConnectWordPress', (event, arg) => {
            this.currentAppSettings = this.settingsService.currentSettings;

            const windowParams = {
                alwaysOnTop: true,
                autoHideMenuBar: true,
                nodeIntegration: false
            };
            var config = {
                clientId: this.currentAppSettings.oAuth2Groups[0].oAuthClientId,
                clientSecret:  this.currentAppSettings.oAuth2Groups[0].oAuthClientSecret,
                authorizationUrl: this.currentAppSettings.oAuth2Groups[0].baseUrl + '/' + this.currentAppSettings.oAuth2Groups[0].authorizeUrl,
                tokenUrl:  this.currentAppSettings.oAuth2Groups[0].baseUrl + '/' +  this.currentAppSettings.oAuth2Groups[0].tokenUrl,
                useBasicAuthorizationHeader: false,
                redirectUrl: this.currentAppSettings.oAuth2Groups[0].redirectUrl
            };

            const options = {};

            const myAuthenticator = new oAuth2(config, windowParams);

            myAuthenticator.getAccessToken(options)
            .then((token: any)=> {
                try
                {
                    console.log("SUCCESS: accessToken retrieved");
                    this.currentAppSettings.oAuth2Groups[0].accessToken = token.access_token;
                    this.currentAppSettings.oAuth2Groups[0].clientSecret = token;
                    this.settingsService.save();
                }
                catch(err)
                {
                    console.log("ERROR: Failed to retrieve accessToken", err);
                }
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
