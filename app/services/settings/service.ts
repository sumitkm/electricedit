///<reference path="./model/appSettings" />
import * as model from "./model/appSettings";
import * as nconf from 'nconf';
import * as fs from 'fs';
import * as electron from "electron";

class Service {

    public currentSettings = new model.appSettings();
    private app : Electron.App = electron.app;

    constructor(currentApp: Electron.App)
    {
        this.app = currentApp;
    }

    public load(callback: (currentSettings: model.appSettings) => void = null)
    {
        try
        {
            nconf.file( this.app.getAppPath() + '/config.json');
            nconf.load((data) =>
            {
                this.currentSettings.autoReopen = nconf.get('autoReopen');
                this.currentSettings.lastOpenFile = nconf.get('lastOpenFile');
                this.currentSettings.oAuth2Groups = nconf.get('oAuth2Groups');
                if(callback!=null)
                {
                    callback(this.currentSettings);
                }
            });
        }
        catch(error)
        {
            console.log(error);
        }
    }

    public set(name: string, value: any)
    {
        nconf.set(name, value);
        (<any>this.currentSettings)[name] = <any>value;
    }

    public get()
    {
        return this.currentSettings;
    }

    public saveSettings(settings: model.appSettings)
    {
        nconf.set('autoReopen', settings.autoReopen);
        nconf.set('lastOpenFile', settings.lastOpenFile);
        nconf.set('oAuth2Groups', settings.oAuth2Groups);
        this.save();
    }

    public save()
    {
        nconf.save((err: any) => {
            fs.readFile(this.app.getAppPath() + '/config.json', (err, data) => {
                console.dir(JSON.parse(data.toString()))
            });
        });
    }
}

export { Service };
export { model };
