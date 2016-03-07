/// <amd-dependency path="text!./post-blog.html"/>

export var template = require("text!./post-blog.html");
import eeJson = require("../../model/eeJson");
import attachmentFile = require("../../model/attachmentFile");
import MySite = require("../../model/mySite");
import ko = require("knockout");

export class viewModel {
    id: KnockoutObservable<string> = ko.observable<string>("");
    selectedSiteId: KnockoutObservable<string> = ko.observable<string>("");
    eeJsonVm: KnockoutObservable<eeJson> = ko.observable<eeJson>();
    mySites: KnockoutObservableArray<MySite>;
    slug: KnockoutObservable<string> = ko.observable<string>();
    myRecentPosts: KnockoutObservableArray<any>;
    selectedPostId: KnockoutObservable<string> = ko.observable<string>("");
    recentPostsInSelectedSite: KnockoutObservableArray<any> = ko.observableArray<any>([]);

    subscriptions = [];

    constructor(params) {
        this.id(params.id);
        this.mySites = params.mySites;
        this.eeJsonVm = params.file;
        this.myRecentPosts = params.myRecentPosts;
        this.subscriptions.push(this.selectedSiteId.subscribe((newValue)=>
        {
            var list = ko.utils.arrayFilter<any>(this.myRecentPosts(), post => post.site_ID == this.selectedSiteId());
            this.recentPostsInSelectedSite.removeAll();
            ko.utils.arrayPushAll(this.recentPostsInSelectedSite, list);
        }));
        ipcRenderer.send("app.View.GetRecentPosts");
    }

    publish = () => {
        console.log("site id:" + this.selectedSiteId());
        this.eeJsonVm().siteId(this.selectedSiteId());
        this.eeJsonVm().postId(this.selectedPostId());
        ipcRenderer.send("app.View.PostBlog", {
            selectedSiteId: this.selectedSiteId(),
            selectedPostId: this.selectedPostId(),
            content: this.eeJsonVm().content(),
            title: this.eeJsonVm().title(),
            media: this.eeJsonVm().media()
        });
    }
}
