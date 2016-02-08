import Files = require("./services/files/files");
import settings = require("./services/settings/settings");

class eventHandler
{
    private ipcMain : GitHubElectron.IPCMain = require('electron').ipcMain;
    private nconf = require('nconf');
    currentWindow: GitHubElectron.BrowserWindow;
    currentSettingsSvc: settings;
    currentFiles: any;

    constructor()
    {
        this.currentSettingsSvc = new settings();
    }

    public attach = (mainWindow: GitHubElectron.BrowserWindow)=>
    {
        this.currentWindow = mainWindow;
        this.currentFiles = new Files(mainWindow);

        this.ipcMain.on("menu.File.New", (event, arg) => {
            this.currentFiles.New();
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
                console.log("Adding to nConf:" + arg.fileName);
                this.currentSettingsSvc.set('lastOpenFile', arg.fileName );
            }
            this.currentFiles.Save(event, arg);
        });

        this.ipcMain.on('settings.App.Save', (event, arg) =>{
            this.currentSettingsSvc.saveSettings(arg);
        })
    }

    public detach()
    {
        this.currentFiles = null;
        this.currentSettingsSvc = null;
    }
}

export = eventHandler;
