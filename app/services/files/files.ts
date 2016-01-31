///<reference path="../../interop.ts"/>
/// <reference path="../../../typings/tsd.d.ts"/>

export class Files {
    mainWindow: any;
    file: any;
    currentEvent: GitHubElectron.IPCMainEvent;

    constructor(window: any) {
        this.mainWindow = window;
    }

    public Save = (event: GitHubElectron.IPCMainEvent, content: any) => {
        this.currentEvent = event;
        this.file = content;
        if (this.file.fileName == '') {
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

    public New = () => {
        // TODO:
    }

    private OpenFile = (fileNames: Array<string>) => {
        var fs = require('fs');
        if (fileNames != null && fileNames.length > 0) {
            fs.readFile(fileNames[0], { encoding: 'utf8', flag: 'r' }, (err, data) => {
                if (err) {
                    throw err;
                }
                else {
                    console.log("File opened successfully!");
                    this.currentEvent.sender.send('menu.file.opened', { fileName: fileNames[0], content: data });
                }
            });
        }
    }

    private WriteToFile = (filename) => {
        if (filename != null) {
            var fs = require('fs');
            fs.writeFile(filename, this.file.content, (err) => {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });
        }
    }
}
