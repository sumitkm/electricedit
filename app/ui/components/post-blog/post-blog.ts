/// <amd-dependency path="text!./post-blog.html"/>

export var template = require("text!./post-blog.html");
import eeJson = require("../../model/eeJson");
import attachmentFile = require("../../model/attachmentFile");
import mySite = require("../../model/mySite");
import ko = require("knockout");
import category = require("../../model/category");
import treeNodeVm = require("../tree-node/treeNodeVm");

export class viewModel {
    id: KnockoutObservable<string> = ko.observable<string>("");
    selectedSiteId: KnockoutObservable<string> = ko.observable<string>("");
    eeJsonVm: KnockoutObservable<eeJson> = ko.observable<eeJson>();
    mySites: KnockoutObservableArray<mySite>;
    slug: KnockoutObservable<string> = ko.observable<string>();
    myRecentPosts: KnockoutObservableArray<any>;
    selectedPostId: KnockoutObservable<string> = ko.observable<string>("");
    recentPostsInSelectedSite: KnockoutObservableArray<any> = ko.observableArray<any>([]);
    //categories: KnockoutObservableArray<category> = ko.observableArray<category>([]);
    categoryNodes: KnockoutObservableArray<treeNodeVm> = ko.observableArray<treeNodeVm>([]);

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

            ipcRenderer.send("app.View.GetCategories", newValue);
        }));


        ipcRenderer.send("app.View.GetRecentPosts");
        ipcRenderer.on("app.View.Categories.Loaded", this.setupCategories);
    }

    setupCategories = (event: any, categories: Array<any>) => {
        console.log(JSON.stringify(categories));
        for (let i = 0; i < categories.length; i++) {
            var node = new treeNodeVm();
            node.text(categories[i].name);
            node.showCheckBox(true);
            node.dataSource(category[i]);
            this.categoryNodes.push(node);
        }
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

    closePanel = () => {
        console.log("Raising event");
        ipcRenderer.send("app.side-panel.onhide");
    }

    public dispose()
    {
        for(let i=0; i<this.subscriptions.length; i++)
        {
            this.subscriptions[i].dispose();
        }
    }
}
