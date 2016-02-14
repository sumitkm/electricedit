/// <reference path="./services/wordpress/api/sites" />

import files = require("./services/files/files");
import settings = require("./services/settings/settings");
import wpSites = require("./services/wordpress/api/sites");
import wpPosts = require("./services/wordpress/api/posts");
import wmq = require('./services/wordpress/model/query/mySites');
import model = require("./services/settings/model/appSettings");
import settingsModel = require("./services/settings/model/appSettings");
import settingsService = require("./services/settings/settings");

class eventHandler
{
    private postsQuery = new wpPosts.createNewPost("","");
    private ipcMain : GitHubElectron.IPCMain = require('electron').ipcMain;
    private nconf = require('nconf');
    currentWindow: GitHubElectron.BrowserWindow;
    currentSettingsSvc: settings;
    wpSitesService: wpSites.wordpress.api.sites.getMySites;
    currentFiles: files;
    currentSettings = new model.appSettings();
    currentAppSettings: settingsModel.appSettings;
    settingsService = new settingsService();


    constructor()
    {
        this.currentSettingsSvc = new settings();
        this.settingsService.load();
    }

    public attach = (mainWindow: GitHubElectron.BrowserWindow)=>
    {
        this.currentWindow = mainWindow;
        this.currentFiles = new files(mainWindow);

        this.ipcMain.on("menu.File.OnNew", (event, arg) => {
            event.sender.send("menu.File.OnNew");
        });

        this.ipcMain.on("app.File.New", (event, arg) =>
        {
            this.currentFiles.New(event, arg);
        });

        this.ipcMain.on("menu.File.Open", (event, arg) => {
            this.currentFiles.Open(event);
        });

        this.ipcMain.on("app.File.Load", (event, arg) => {
            this.currentFiles.Load(event, [arg]);
        });

        this.ipcMain.on("menu.File.OnSave", (event, arg) => {
            event.sender.send("menu.File.Save");
        });

        this.ipcMain.on("menu.View.OnSettings", (event, arg) => {
            event.sender.send("menu.View.Settings", this.nconf);
        });

        this.ipcMain.on("app.File.Save", (event, arg) => {
            if (arg.fileName != '') {
                this.currentSettingsSvc.set('lastOpenFile', arg.fileName );
            }
            this.currentFiles.Save(event, arg);
        });

        this.ipcMain.on('settings.App.Save', (event, arg) =>{
            this.currentSettingsSvc.saveSettings(arg);
        })

        this.ipcMain.on("menu.View.GetMySites", (event, arg) =>
        {
            this.currentAppSettings = this.settingsService.currentSettings;
            this.wpSitesService = new wpSites.wordpress.api.sites.getMySites(this.currentAppSettings.oAuth2Groups[0].accessToken);
            var query = new wmq.wordpress.model.query.mySites();
            query.pretty = true;
            query.site_visibility = "all";
            query.fields = "ID,name,description,url,visible,is_private";
            this.wpSitesService.execute(query, null, (json) => {
                console.log("GET MY SITES: " + JSON.stringify(json));
            });
        });
    }

    public detach()
    {
        this.currentFiles = null;
        this.currentSettingsSvc = null;
    }
}

export = eventHandler;
