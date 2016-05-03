/// <amd-dependency path="text!./print-preview.html" />
import * as ko from "knockout";

export var template = require("text!./print-preview.html");
export class viewModel
{
    previewHtml: KnockoutObservable<string> = ko.observable<string>("<h1> Print Preview</h1>");
    subscriptions = new Array<KnockoutSubscription>();
    constructor(params)
    {
        this.previewHtml = params.previewHtml;
        // this.subscriptions.push(this.previewHtml.subscribe((newValue)=>{
        //
        // }));
    }

    onKeyPress = (event) =>
    {
        console.log(event);
    }

    dispose()
    {
        // for (let i = 0; i < this.subscriptions.length; i++) {
        //     this.subscriptions[i].dispose();
        // }
    }
}
