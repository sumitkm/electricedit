import queries = require('./model/query/query');
import requets = require('./model/request/request');
import wpSites = require("./api/sites");
import wpPosts = require("./api/posts");
import settingsModel = require("../settings/model/appSettings");

    export class wordpress
    {
        private _apiKey = "";
        private wpGetMySitesSvc: wpSites.wordpress.api.sites.getMySites;
        private wpGetSiteCategoriesSvc: wpSites.wordpress.api.sites.getCategories;

        constructor(apiKey: string)
        {
            this._apiKey = apiKey;
            this.wpGetMySitesSvc = new wpSites.wordpress.api.sites.getMySites(this._apiKey);

        }

        public getSiteCategories = (event: GitHubElectron.IPCMainEvent, siteId: string) =>
        {
            this.wpGetSiteCategoriesSvc = new wpSites.wordpress.api.sites.getCategories(this._apiKey, siteId);
            let mySitesQuery = new queries.wordpress.model.query.mySites();
            mySitesQuery.pretty = true;

            this.wpGetSiteCategoriesSvc.execute(mySitesQuery, null, (json: Array<any>)=> {
                console.log("Categories count: "+ json.length);
                event.sender.send("app.View.Categories.Loaded", json);
            });
        }

        public getAccountDetails = (event: GitHubElectron.IPCMainEvent, appSettings: settingsModel.appSettings) =>
        {
            let mySitesQuery = new queries.wordpress.model.query.mySites();
            mySitesQuery.pretty = true;
            mySitesQuery.site_visibility = "all";
            mySitesQuery.fields = "ID,name,description,url,visible,is_private";
            let sites = new Array<any>();

            this.wpGetMySitesSvc.execute(mySitesQuery, null, (json) => {
                console.log("My Sites (count) : " + json.length)
                sites = json;
                event.sender.send("app.View.ShowPostBlog", sites);
            });

            let myPostsQuery = new queries.wordpress.model.query.myPosts();
            myPostsQuery.pretty = true;
            let wpGetAllPostsSvc = new wpPosts.wordpress.api.posts.getAllPosts(this._apiKey);
            wpGetAllPostsSvc.execute(myPostsQuery, null, (data: any) =>
            {
                console.log("Recent Posts (count): " + data.posts.length);
                event.sender.send("app.view.myPosts", data.posts);
            });
        }

    }
this._apiKey
