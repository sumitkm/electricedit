///<reference path="./model/appSettings" />
import * as model from "./model/appSettings";
var nconf = require('nconf');
var fs = require('fs');

export class settings{

    public currentSettings = new model.appSettings();

    constructor()
    {
    }

    public load()
    {
        nconf.file('./config.json');
        nconf.load((data)=>{
            this.currentSettings = data;
            console.log(JSON.stringify(data));
        });
    }

    public set(name: string, value: any)
    {
        nconf.set(name, value);
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
        nconf.save((err) => {
            fs.readFile('./config.json', (err, data) => {
                console.dir(JSON.parse(data.toString()))
            });
        });
    }
}
