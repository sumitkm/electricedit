/// <reference path="./services/wordpress/api/sites" />

import * as wordpress  from "./services/wordpress/service";
import * as settings from "./services/settings/service";
import * as files  from "./services/files/service";

class EventHandler {
    private ipcMain: Electron.IpcMain = require('electron').ipcMain;

    private nconf = require('nconf');
    currentWindow: Electron.BrowserWindow;
    currentSettingsSvc: settings.Service;
    getMySitesService: wordpress.api.sites.getMySites;
    currentFileServices: files.service;
    currentAppSettings: settings.model.appSettings;

    constructor(currentApp: Electron.App) {
        this.currentSettingsSvc = new settings.Service(currentApp);
        this.currentSettingsSvc.load((newSettings: settings.model.appSettings)=>{
            this.currentAppSettings = newSettings;
            this.getMySitesService = new wordpress.api.sites.getMySites(this.currentAppSettings.oAuth2Groups[0].accessToken);
        });
    }

    public attach = (mainWindow: Electron.BrowserWindow) => {
        this.currentWindow = mainWindow;
        this.currentFileServices = new files.service(mainWindow);

        this.ipcMain.on("menu.File.OnNew", (event, arg) => {
            event.sender.send("menu.File.OnNew");
        });

        this.ipcMain.on("app.File.New", (event, arg) => {
            this.currentFileServices.New(event, arg);
        });

        this.ipcMain.on("menu.File.Open", (event, arg) => {
            this.currentFileServices.Open(event);
        });

        this.ipcMain.on("app.File.Load", (event, arg) => {
            this.currentFileServices.Load(event, [arg]);
        });

        this.ipcMain.on("attachment.image.Save", (event, arg) => {
            this.currentFileServices.Save(event, arg);
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
            this.currentFileServices.Save(event, arg);
        });

        this.ipcMain.on('settings.App.Save', (event, arg) => {
            this.currentSettingsSvc.saveSettings(arg);
        })

        this.ipcMain.on("menu.View.GetMySites", (event, arg) => {
            var connector = new wordpress.service(this.currentAppSettings.oAuth2Groups[0].accessToken);
            connector.getAccountDetails(event, this.currentAppSettings);
        });

        this.ipcMain.on("app.View.GetCategories", (event: Electron.IpcMainEvent, arg: string)=>
        {
            var connector = new wordpress.service(this.currentAppSettings.oAuth2Groups[0].accessToken);
            connector.getSiteCategories(event, arg);
        });

        this.ipcMain.on("app.side-panel.onhide", (event: Electron.IpcMainEvent, arg: any)=>{
            event.sender.send("app.side-panel.hide");
        });

        this.ipcMain.on("app.view.post.treeview.nodecheckchanged", (event: Electron.IpcMainEvent, arg: any) => {
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
                let wpCreatePostSvc = new wordpress.api.posts.updatePost
                    (this.currentAppSettings.oAuth2Groups[0].accessToken, selectedSiteId, arg.selectedPostId);

                console.log("Updating post (ID): " + JSON.stringify(arg,null,3));//.selectedPostId);

                let postQuery = new wordpress.model.query.postNew();
                postQuery.pretty = true;
                let postUpdate = new wordpress.model.request.postNew();
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
                let wpCreatePostSvc = new wordpress.api.posts.createNewPost
                    (this.currentAppSettings.oAuth2Groups[0].accessToken, selectedSiteId);

                let postQuery = new wordpress.model.query.postNew();
                postQuery.pretty = true;
                let postNew = new wordpress.model.request.postNew();
                postNew.title = arg.title;
                postNew.content = arg.content;
                postNew.media = arg.media;

                wpCreatePostSvc.execute(postQuery, postNew, (data) => {
                    console.log("Created post successfully." + JSON.stringify(data));
                    event.sender.send("app.View.PostedSuccessfully", data);
                });
            }
        });

        this.ipcMain.on("paste", (event, arg) =>
        {
            var clipboard = require('electron').clipboard;
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
            this.currentFileServices.NewFileName(event);
        });

        this.ipcMain.on("menu.File.OnPrint", (event, arg)=>
        {
            event.sender.send("menu.File.OnPrint", arg);
        });

        this.ipcMain.on("app.File.PrintPreview", (event, arg) => {
            // let electron = require("electron");
            // let BrowserWindow = electron.BrowserWindow;
            // let printWindow = new BrowserWindow();
            // let ipcRenderer : Electron.IpcRenderer = electron.ipcRenderer;
            //
            // printWindow.loadURL("file://" + __dirname + "/ui/print.html");
            // printWindow.show();
            console.log("Ready to print");
            this.currentWindow.webContents.print();
            //this.ipcMain.emit("app.File.PreviewOf", arg);

        });
    }

    public detach() {
        this.currentFileServices = null;
        this.currentSettingsSvc = null;
    }
}

export { EventHandler };
