///<reference path="./model/appSettings" />
import * as model from "./model/appSettings";
import nconf = require('nconf');
import fs = require('fs');

class service {

    public currentSettings = new model.appSettings();

    constructor()
    {
    }

    public load(callback: (currentSettings: model.appSettings) => void = null)
    {
        try
        {
            nconf.file('./config.json');
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
            fs.readFile('./config.json', (err, data) => {
                console.dir(JSON.parse(data.toString()))
            });
        });
    }
}

export { service };
export { model };
