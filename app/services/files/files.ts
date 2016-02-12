/// <reference path="../../interop.ts"/>
/// <reference path="../../../typings/tsd.d.ts"/>

class Files {
    mainWindow: any;
    file: any;
    currentEvent: GitHubElectron.IPCMainEvent;
    fileCreated: boolean = false;

    constructor(window: any) {
        this.mainWindow = window;
    }

    public Save = (event: GitHubElectron.IPCMainEvent, content: any) => {
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
                        { name: 'All Files', extensions: ['*'] },
                        { name: 'HTML', extensions: ['html', 'htm'] }
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
                    { name: 'All Files', extensions: ['*'] },
                    { name: 'HTML', extensions: ['html', 'htm'] }
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
                buttons: ['Cancel', 'Save', 'Discard'] }, (index: number)=>
                {
                    console.log('Button Index: '+ index);
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
                    event.sender.send('menu.file.opened', { fileName: fileNames[0], content: data });
                }
            });
        }
    }
    private OpenFile = (fileNames: Array<string>) => {
        this.Load(this.currentEvent, fileNames);
    }

    private WriteToFile = (filename) => {
        if (filename != null)
        {
            var fs = require('fs');
            this.file.filename = filename;
            fs.writeFile(filename, this.file.content, (err) =>
            {
                if (err)
                {
                    return console.log(err);
                }
                if(this.fileCreated == true)
                {
                    this.currentEvent.sender.send('app.File.Created', this.file);
                }
                console.log("The file was saved!");
            });
        }
    }
}

export = Files;
