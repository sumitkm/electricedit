/// <amd-dependency path="text!./save-attachments.html" />

import CurrentFile = require("../../model/currentFile");
import ko  = require("knockout");
export var template = require("text!./save-attachments.html");

export class viewModel
{
    id: KnockoutObservable<string> = ko.observable("saveAttachments");
    imageData: KnockoutObservable<string> = ko.observable("");
    destinationFileName: KnockoutObservable<string> = ko.observable("");
    altText: KnockoutObservable<string> = ko.observable("");

    constructor(params)
    {
        if(params.id !=null)
        {
            this.id(params.id);
        }
        this.imageData = params.imageData;


    }

    save = () =>
    {

    }
}
