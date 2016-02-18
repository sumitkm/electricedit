/// <amd-dependency path="text!./post-blog.html"/>

export var template = require("text!./post-blog.html");
import CurrentFile = require("../../model/currentFile");
import MySite = require("../../model/mySite");
import ko = require("knockout");

export class viewModel {
    id: KnockoutObservable<string> = ko.observable<string>("");
    selectedSiteId: KnockoutObservable<string> = ko.observable<string>("");
    currentFile: KnockoutObservable<CurrentFile> = ko.observable<CurrentFile>();
    mySites: KnockoutObservableArray<MySite>;
    title: KnockoutObservable<string> = ko.observable<string>();
    slug: KnockoutObservable<string> = ko.observable<string>();
    recentPosts: KnockoutObservableArray<any> = ko.observableArray<any>([]);
    selectedPostId: KnockoutObservable<string> = ko.observable<string>("");
    
    constructor(params) {
        this.id(params.id);
        this.mySites = params.mySites;
        console.log("Length: " + this.mySites().length);
        this.currentFile = params.file;
        ipcRenderer.send("app.View.GetRecentPosts");

        ipcRenderer.on("app.view.myPosts", (data) => {
            ko.utils.arrayPushAll<any>(this.recentPosts, data);
        });
    }

    publish = () => {
        console.log("site id:" + this.selectedSiteId());
        ipcRenderer.send("app.View.PostBlog", { selectedSiteId: this.selectedSiteId(), content: this.currentFile().content, title: this.title() });
    }
}
