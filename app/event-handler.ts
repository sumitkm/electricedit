/// <reference path="./services/wordpress/api/sites" />

import files = require("./services/files/files");
import settings = require("./services/settings/settings");
import wpSites = require("./services/wordpress/api/sites");
import wpPosts = require("./services/wordpress/api/posts");
import wmq = require('./services/wordpress/model/query/mySites');
import wmpm = require('./services/wordpress/model/query/postNew');
import wmmp = require('./services/wordpress/model/query/myPosts');
import wmr = require('./services/wordpress/model/request/postNew');
import model = require("./services/settings/model/appSettings");
import settingsModel = require("./services/settings/model/appSettings");
import settingsService = require("./services/settings/settings");

class eventHandler {
    private postsQuery;
    private ipcMain: GitHubElectron.IPCMain = require('electron').ipcMain;
    private nconf = require('nconf');
    currentWindow: GitHubElectron.BrowserWindow;
    currentSettingsSvc: settings;
    wpGetMySitesSvc: wpSites.wordpress.api.sites.getMySites;
    wpCreatePostSvc: wpPosts.wordpress.api.posts.createNewPost;
    wpUpdatePostSvc: wpPosts.wordpress.api.posts.updatePost;
    wpGetAllPostsSvc: wpPosts.wordpress.api.posts.getAllPosts;
    currentFiles: files;
    currentSettings = new model.appSettings();
    currentAppSettings: settingsModel.appSettings;
    settingsService = new settingsService();

    constructor() {
        this.currentSettingsSvc = new settings();
        this.settingsService.load();
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
            this.currentAppSettings = this.settingsService.currentSettings;
            this.wpGetMySitesSvc = new wpSites.wordpress.api.sites.getMySites(this.currentAppSettings.oAuth2Groups[0].accessToken);
            var query = new wmq.wordpress.model.query.mySites();
            query.pretty = true;
            query.site_visibility = "all";
            query.fields = "ID,name,description,url,visible,is_private";
            var sites = new Array<any>();
            this.wpGetMySitesSvc.execute(query, null, (json) => {
                console.log("My Sites (count) : " + json.length)
                sites = json;
                event.sender.send("app.View.ShowPostBlog", sites);
            });


            var postNew = new wmmp.wordpress.model.query.myPosts();
            postNew.pretty = true;
            this.wpGetAllPostsSvc = new wpPosts.wordpress.api.posts.getAllPosts(this.currentAppSettings.oAuth2Groups[0].accessToken);
            this.wpGetAllPostsSvc.execute(postNew, null, (data) =>
            {
                console.log("Recent Posts (count): " + data.posts.length);
                event.sender.send("app.view.myPosts", data.posts);
            });
        });

        this.ipcMain.on("app.View.PostBlog", (event, arg)=>
        {
            var selectedSiteId = arg.selectedSiteId;
            console.log("Site ID: " + selectedSiteId);

            if(arg.selectedPostId!=null && arg.selectedPostId != '')
            {
                this.wpCreatePostSvc = new wpPosts.wordpress.api.posts.updatePost
                    (this.currentAppSettings.oAuth2Groups[0].accessToken, selectedSiteId, arg.selectedPostId);

                console.log("Updating post (ID): " + arg.selectedPostId);
                var postQuery = new wmpm.wordpress.model.query.postNew();
                postQuery.pretty = true;
                var postUpdate = new wmr.wordpress.model.request.postNew();
                postUpdate.title = arg.title;
                postUpdate.content = arg.content;
                this.wpCreatePostSvc.execute(postQuery, postUpdate, (data) => {
                    console.log("Updated post successfully.");
                    event.sender.send("app.View.UpdatedSuccessfully", data);
                });
            }
            else
            {
                this.wpCreatePostSvc = new wpPosts.wordpress.api.posts.createNewPost
                    (this.currentAppSettings.oAuth2Groups[0].accessToken, selectedSiteId);

                var postQuery = new wmpm.wordpress.model.query.postNew();
                postQuery.pretty = true;
                var postNew = new wmr.wordpress.model.request.postNew();
                postNew.title = arg.title;
                postNew.content = arg.content;
                this.wpCreatePostSvc.execute(postQuery, postNew, (data) => {
                    console.log("Created post successfully.");
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
    }

    public detach() {
        this.currentFiles = null;
        this.currentSettingsSvc = null;
    }
}

export = eventHandler;
