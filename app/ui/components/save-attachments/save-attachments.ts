/// <amd-dependency path="text!./save-attachments.html" />

import attachmentFile = require("../../model/attachmentFile");
import ko  = require("knockout");
export var template = require("text!./save-attachments.html");

export class viewModel
{
    id: KnockoutObservable<string> = ko.observable("saveAttachments");
    imageData: KnockoutObservable<string> = ko.observable("");
    destinationFileName: KnockoutObservable<string> = ko.observable("");
    altText: KnockoutObservable<string> = ko.observable("");
    currentFile: KnockoutObservable<attachmentFile> = ko.observable(new attachmentFile());

    constructor(params)
    {
        if(params.id !=null)
        {
            this.id(params.id);
        }
        this.currentFile().rawContent = params.imageData;

        ipcRenderer.on('attachment.set.fileName', (event, fileName)=>
        {
            console.log('New file Name: '+ JSON.stringify(fileName,null,2));
            this.currentFile().fileName(fileName);
        });
    }

    getFileName = () =>
    {
        ipcRenderer.send('attachment.get.fileName');
    }

    save = () =>
    {
        console.log(ko.toJS(this.currentFile));
        ipcRenderer.send('app.File.Save', ko.toJS(this.currentFile));
    }
}
