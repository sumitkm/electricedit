/// <amd-dependency path="text!./post-blog.html"/>

export var template = require("text!./post-blog.html");
import CurrentFile = require("../../model/currentFile");
import MySite = require("../../model/mySite");
export class viewModel
{
    currentFile: KnockoutObservable<CurrentFile> = ko.observable<CurrentFile>();
    mySites: KnockoutObservableArray<MySite> = ko.observableArray<MySite>();
    constructor(params)
    {

    }

}
