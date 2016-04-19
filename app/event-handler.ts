/// <reference path="./services/wordpress/api/sites" />

import files = require("./services/files/files");
import wpSites = require("./services/wordpress/api/sites");
import wpPosts = require("./services/wordpress/api/posts");
import queries = require('./services/wordpress/model/query/query');
import requets = require('./services/wordpress/model/request/request');
import responses = require('./services/wordpress/model/response/response');
import wpapi = require('./services/wordpress/wordpress');
import model = require("./services/settings/model/appSettings");
import settingsModel = require("./services/settings/model/appSettings");
import settingsService = require("./services/settings/settings");

class eventHandler {
    private ipcMain: GitHubElectron.IPCMain = require('electron').ipcMain;
    private nconf = require('nconf');
    currentWindow: GitHubElectron.BrowserWindow;
    currentSettingsSvc: settingsService;
    wpGetMySitesSvc: wpSites.wordpress.api.sites.getMySites;
    // wpUpdatePostSvc: wpPosts.wordpress.api.posts.updatePost;
    // wpGetAllPostsSvc: wpPosts.wordpress.api.posts.getAllPosts;
    currentFiles: files;
    currentSettings = new model.appSettings();
    currentAppSettings: settingsModel.appSettings;
    settingsService = new settingsService();

    constructor() {
        this.currentSettingsSvc = new settingsService();
        this.settingsService.load((newSettings: settingsModel.appSettings)=>{
            this.currentAppSettings = newSettings;
            this.wpGetMySitesSvc = new wpSites.wordpress.api.sites.getMySites(this.currentAppSettings.oAuth2Groups[0].accessToken);
        });
    }

    public attach = (mainWindow: GitHubElectron.BrowserWindow) => {
        this.currentWindow = mainWindow;
        this.currentFiles = new files(mainWindow);

        this.ipcMain.on("menu.File.OnNew", (event, arg) => {
            event.sender.send("menu.File.OnNew");
        });

        this.ipcMain.on("app.File.New", (event, arg) => {
            this.currentFiles.New(event, arg);
        });

        this.ipcMain.on("menu.File.Open", (event, arg) => {
            this.currentFiles.Open(event);
        });

        this.ipcMain.on("app.File.Load", (event, arg) => {
            this.currentFiles.Load(event, [arg]);
        });

        this.ipcMain.on("attachment.image.Save", (event, arg) => {
            this.currentFiles.Save(event, arg);
        });

        this.ipcMain.on("menu.File.OnSave", (event, arg) => {
            event.sender.send("menu.File.Save");
        });

        this.ipcMain.on("menu.View.OnSettings", (event, arg) => {
            event.sender.send("menu.View.Settings", this.nconf);
        });

        this.ipcMain.on("app.File.Save", (event, arg) => {
            if (arg.fileName != '') {
                this.currentSettingsSvc.set('lastOpenFile', arg.fileName);
            }
            this.currentFiles.Save(event, arg);
        });

        this.ipcMain.on('settings.App.Save', (event, arg) => {
            this.currentSettingsSvc.saveSettings(arg);
        })

        this.ipcMain.on("menu.View.GetMySites", (event, arg) => {
            //this.currentAppSettings = this.settingsService.currentSettings;
            var connector = new wpapi.wordpress(this.currentAppSettings.oAuth2Groups[0].accessToken);
            connector.getAccountDetails(event, this.currentAppSettings);
        });

        this.ipcMain.on("app.View.GetCategories", (event: GitHubElectron.IPCMainEvent, arg: string)=>
        {
            var connector = new wpapi.wordpress(this.currentAppSettings.oAuth2Groups[0].accessToken);
            connector.getSiteCategories(event, arg);
        });

        this.ipcMain.on("app.side-panel.onhide", (event: GitHubElectron.IPCMainEvent, arg: any)=>{
            event.sender.send("app.side-panel.hide");
        });

        this.ipcMain.on("app.view.post.treeview.nodecheckchanged", (event: GitHubElectron.IPCMainEvent, arg: any) => {
            console.log("nodecheckchanged:" + arg.checked + " DataSource: "+ arg.dataSource);
            if(arg.checked == true)
            {
                event.sender.send("app.view.post.categoryadded", arg.dataSource);
            }
            else{
                event.sender.send("app.view.post.categoryremoved", arg.dataSource);
            }
        });

        this.ipcMain.on("app.View.PostBlog", (event, arg)=>
        {
            let selectedSiteId = arg.selectedSiteId;
            console.log("Site ID: " + selectedSiteId);

            if(arg.selectedPostId!=null && arg.selectedPostId != '')
            {
                let wpCreatePostSvc = new wpPosts.wordpress.api.posts.updatePost
                    (this.currentAppSettings.oAuth2Groups[0].accessToken, selectedSiteId, arg.selectedPostId);

                console.log("Updating post (ID): " + JSON.stringify(arg,null,3));//.selectedPostId);

                let postQuery = new queries.wordpress.model.query.postNew();
                postQuery.pretty = true;
                let postUpdate = new requets.wordpress.model.request.postNew();
                postUpdate.title = arg.title;
                postUpdate.content = arg.content;
                postUpdate.media = arg.media;

                wpCreatePostSvc.execute(postQuery, postUpdate, (data) => {
                    console.log("Updated post successfully.");
                    event.sender.send("app.View.UpdatedSuccessfully", data);
                });
            }
            else
            {
                let wpCreatePostSvc = new wpPosts.wordpress.api.posts.createNewPost
                    (this.currentAppSettings.oAuth2Groups[0].accessToken, selectedSiteId);

                let postQuery = new queries.wordpress.model.query.postNew();
                postQuery.pretty = true;
                let postNew = new requets.wordpress.model.request.postNew();
                postNew.title = arg.title;
                postNew.content = arg.content;
                postNew.media = arg.media;

                wpCreatePostSvc.execute(postQuery, postNew, (data) => {
                    console.log("Created post successfully." + JSON.stringify(data));
                    event.sender.send("app.View.PostedSuccessfully", data);
                });
            }
        });

        // this.ipcMain.on("app.View.GetRecentPosts", (event, arg) =>
        // {
        //
        // });

        this.ipcMain.on("paste", (event, arg) =>
        {
            var clipboard = require('clipboard');
            var image = clipboard.readImage();
            if(image.isEmpty())
            {
                console.log("Clipboard Type Text.");

                var value = clipboard.readText();
                event.sender.send("paste.html", value);
            }
            else
            {
                console.log("Clipboard Type Image.");
                event.sender.send("paste.image", image.toDataURL());
            }
        });

        this.ipcMain.on("attachment.get.fileName", (event, arg)=>
        {
            this.currentFiles.NewFileName(event);
        });
    }

    public detach() {
        this.currentFiles = null;
        this.currentSettingsSvc = null;
    }
}

export = eventHandler;
