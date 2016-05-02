/// <amd-dependency path="text!./print-preview.html" />
import * as ko from "knockout";

export var template = require("text!./print-preview.html");
export class viewModel
{
    previewHtml: KnockoutObservable<string> = ko.observable<string>("<h1> Print Preview </h1>   ");
    constructor()
    {
        ipcRenderer.on("app.File.PreviewOf", (args)=>
        {
            console.log(args);
            this.previewHtml(args.content);
        });
    }
}
