/// <reference path="../../interop.ts"/>
/// <reference path="../../../typings/tsd.d.ts"/>

var Jimp = require("jimp");
import eeJson = require("./model/eeJson");
import attachmentFile = require("./model/attachmentFile");

class Files {
    mainWindow: any;
    file: eeJson;
    attachment: attachmentFile;
    currentEvent: GitHubElectron.IPCMainEvent;
    fileCreated: boolean = false;

    constructor(window: any) {
        this.mainWindow = window;
    }

    public Save = (event: GitHubElectron.IPCMainEvent, content: eeJson) => {
        this.currentEvent = event;
        this.file = content;
        if (this.file.fileName == '') {
            this.fileCreated = true;
            var dialog = require('electron').dialog;
            dialog.showSaveDialog(this.mainWindow,
            {
                title: "Save File",
                defaultPath: "/user/sumitkm/Documents",
                filters: [
                    { name: 'Electric edit file', extensions: ['eejson'] },
                    { name: 'Portable network graphics (.png)', extensions: [ 'png' ] },
                    { name: 'JPEG (.jpg)', extensions: [ 'jpg', 'jpeg' ] }
                ]
            }, this.WriteToFile);
        }
        else
        {
            this.WriteToFile(this.file.fileName);
        }
    }

    public Open = (event: GitHubElectron.IPCMainEvent) => {
        this.currentEvent = event;
        var dialog = require('electron').dialog;
        dialog.showOpenDialog(this.mainWindow,
            {
                title: "Open File",
                defaultPath: "/user/sumitkm/Documents",
                filters: [
                    { name: 'Electric edit file', extensions: ['eejson'] }
                ],
                properties: ['openFile', 'createDirectory']
            }, this.OpenFile);
    }

    public New = (event: GitHubElectron.IPCMainEvent, content: any) => {
        this.currentEvent = event;
        var dialog = require('electron').dialog;
        if(content.modified==true)
        {
            dialog.showMessageBox(null,
            {
                title: 'Save changes?',
                message: 'Save changes to current file?',
                type: 'question',
                buttons: ['Cancel', 'Save', 'Discard']
            },
            (index: number)=>
            {
                if(index == 2)
                {
                    event.sender.send("menu.File.Newed");
                }
                else if(index == 1)
                {
                    this.Save(event, content);
                    event.sender.send("menu.File.Newed");
                }
            });
        }
        else
        {
            event.sender.send("menu.File.Newed");
        }
    }

    public NewFileName = (event: GitHubElectron.IPCMainEvent) =>
    {
        this.currentEvent = event;

        var dialog = require('electron').dialog;
        dialog.showSaveDialog(this.mainWindow,
        {
            title: "Save File",
            defaultPath: "/user/sumitkm/Documents",
            filters: [
                { name: 'Portable network graphics (.png)', extensions: [ 'png' ] },
                { name: 'JPEG (.jpg)', extensions: [ 'jpg', 'jpeg' ] }
            ]
        }, (newFileName: string) =>
        {
            console.log("New File Name: " + newFileName);
            this.currentEvent.sender.send('attachment.set.fileName', newFileName);
        });
    }

    public Load = (event, fileNames: Array<string>) =>
    {
        var fs = require('fs');
        if (fileNames != null && fileNames.length > 0) {
            fs.readFile(fileNames[0], { encoding: 'utf8', flag: 'r' }, (err, data) => {
                if (err) {
                    throw err;
                }
                else {
                    console.log("File opened successfully!");
                    var file = JSON.parse(data);
                    file.fileName = fileNames[0];
                    event.sender.send('menu.file.opened', file);
                }
            });
        }
    }

    private OpenFile = (fileNames: Array<string>) => {
        this.Load(this.currentEvent, fileNames);
    }

    private WriteToFile = (filename: string) => {
        if (filename != null)
        {
            var fs = require('fs');
            this.file.fileName = filename;
            if(filename.lastIndexOf('.eejson') > 0)
            {
                fs.writeFile(filename, JSON.stringify(this.file), (err) =>
                {
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    if(this.fileCreated == true)
                    {
                        this.currentEvent.sender.send('app.File.Created', this.file);
                    }
                    console.log("File saved successfully!");
                });
            }
            else
            {
                this.attachment = <any>this.file;
                var response = this.convertBase64Image(this.attachment.rawContent);

                fs.writeFile("temp", response.data, (err) =>
                {
                    if(err)
                    {
                        console.log(err);
                        return err;
                    }
                    else
                    {
                        Jimp.read("temp", (err, lenna)  => {
                            if (err)
                            {
                                console.error("JIMP ERROR: ", err);
                                throw err;
                            }
                            let scaleX = parseFloat(this.attachment.width);
                            console.log("JIMP READ: scaleX - " + scaleX);

                            if(scaleX >= 1)
                            {
                                lenna.resize(
                                    parseInt(this.attachment.width),
                                    parseInt(this.attachment.height))
                                     .quality(90)
                                     .write(this.file.fileName);
                                 this.currentEvent.sender.send('app.File.Attachment.Created', this.file);
                             }
                             else
                             {
                                 console.log("Scale: " + scaleX);
                                 lenna.scale(scaleX)
                                      .quality(90)
                                      .write(this.file.fileName);
                                 this.currentEvent.sender.send('app.File.Attachment.Created', this.file);
                             }
                        });
                    }
                });
            }
        }
    }

    private convertBase64Image = (datastring: string) =>
    {
        let matches = datastring.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let response = { type: '', data: null };
        if(matches!=null && matches.length !== 3)
        {
            throw new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        return response;
    }
}

export = Files;
