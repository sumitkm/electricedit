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
    imageHeight: KnockoutObservable<string> = ko.observable<string>("0");
    imageWidth: KnockoutObservable<string> = ko.observable<string>("0")
    originalHeight: KnockoutObservable<number> = ko.observable<number>(0);
    originalWidth: KnockoutObservable<number> = ko.observable<number>(0);

    subscriptions: Array<KnockoutSubscription> = [];
    constructor(params)
    {
        if(params.id !=null)
        {
            this.id(params.id);
        }

        this.subscriptions.push(this.imageHeight.subscribe((newValue: string) =>
        {
            var pxAt = newValue.indexOf("px");
            var percentAt = newValue.indexOf("%");

            if(percentAt > 0)
            {
                let numericComponent = parseInt(newValue.substr(0, newValue.length - 1));
                this.currentFile().height((numericComponent/100).toString());
            }
            else
            {
                this.currentFile().height(newValue);
            }
        }));

        this.subscriptions.push(this.imageWidth.subscribe((newValue: string) =>
        {
            var pxAt = newValue.indexOf("px");
            var percentAt = newValue.indexOf("%");

            if(percentAt > 0)
            {
                let numericComponent = parseInt(newValue.substr(0, newValue.length - 1));
                this.currentFile().width((numericComponent/100).toString());
            }
            else
            {
                this.currentFile().width(newValue);
            }
        }));

        this.currentFile().rawContent = params.imageData;

        var imageElement = <any>document.getElementById("previewImage");
        imageElement.onload = this.imageLoaded;

        this.currentFile().height(imageElement.naturalHeight);
        this.currentFile().width(imageElement.naturalWidth);

        ipcRenderer.on('attachment.set.fileName', (event, fileName)=>
        {
            console.log('New file Name: '+ JSON.stringify(fileName,null,2));
            this.currentFile().fileName(fileName);
        });
    }

    imageLoaded = (event, args) =>
    {
        var imageElement = <any>document.getElementById("previewImage");
        console.log("image loaded: h-" + imageElement.naturalHeight + ",w-" + imageElement.naturalWidth);
        this.currentFile().height(imageElement.naturalHeight);
        this.currentFile().width(imageElement.naturalWidth);
        // this.imageHeight(imageElement.naturalHeight);
        // this.imageWidth(imageElement.naturalWidth);
        // this.originalHeight(imageElement.naturalHeight);
        // this.originalWidth(imageElement.naturalWidth);
    }

    getFileName = () =>
    {
        ipcRenderer.send('attachment.get.fileName');
    }

    save = () =>
    {
        console.log(ko.toJS(this.currentFile));
        ipcRenderer.send('attachment.image.Save', ko.toJS(this.currentFile));
    }

    dispose()
    {
        for(let i=0;i<this.subscriptions.length; i++)
        {
            this.subscriptions[0].dispose();
        }
    }

}
