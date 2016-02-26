/// <amd-dependency path="text!./save-attachments.html" />

import currentFile = require("../../model/currentFile");
import ko  = require("knockout");
export var template = require("text!./save-attachments.html");

export class viewModel
{
    id: KnockoutObservable<string> = ko.observable("saveAttachments");
    imageData: KnockoutObservable<string> = ko.observable("");
    destinationFileName: KnockoutObservable<string> = ko.observable("");
    altText: KnockoutObservable<string> = ko.observable("");
    currentFile: KnockoutObservable<currentFile> = ko.observable(
        {
            fileName: ko.observable(''),
            content: ko.observable(''),
            modified: ko.observable(false),
            title: ko.observable(''),
            postId: ko.observable(''),
            siteId: ko.observable(''),
            urlSlug: ko.observable(''),
            type: ko.observable('')
        });

    constructor(params)
    {
        if(params.id !=null)
        {
            this.id(params.id);
        }
        this.currentFile().content = params.imageData;
    }

    save = () =>
    {
        console.log(ko.toJS(this.currentFile));
        ipcRenderer.send('app.File.Save', ko.toJS(this.currentFile));
    }
}
