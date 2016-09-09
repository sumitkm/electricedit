import * as api from "./api/api";
import * as model from "./model/model";

import * as settingsModel from "../settings/model/appSettings";

class service
{
    private _apiKey = "";
    private getMySitesService: api.sites.getMySites;
    private wpGetSiteCategoriesSvc: api.sites.getCategories;

    constructor(apiKey: string)
    {
        this._apiKey = apiKey;
        this.getMySitesService = new api.sites.getMySites(this._apiKey);

    }

    public getSiteCategories = (event: Electron.IpcMainEvent, siteId: string) =>
    {
        this.wpGetSiteCategoriesSvc = new api.sites.getCategories(this._apiKey, siteId);
        let mySitesQuery = new model.query.mySites();
        mySitesQuery.pretty = true;

        this.wpGetSiteCategoriesSvc.execute(mySitesQuery, null, (json: Array<model.response.category>)=> {
            console.log("Categories count: "+ json.length);
            event.sender.send("app.View.Categories.Loaded", json);
        });
    }

    public getAccountDetails = (event: Electron.IpcMainEvent, appSettings: settingsModel.appSettings) =>
    {
        let mySitesQuery = new model.query.mySites();
        mySitesQuery.pretty = true;
        mySitesQuery.site_visibility = "all";
        mySitesQuery.fields = "ID,name,description,url,visible,is_private";
        let sites = new Array<any>();

        this.getMySitesService.execute(mySitesQuery, null, (json) => {
            console.log("My Sites (count) : " + json.length)
            sites = json;
            event.sender.send("app.View.ShowPostBlog", sites);
        });

        let myPostsQuery = new model.query.myPosts();
        myPostsQuery.pretty = true;
        let wpGetAllPostsSvc = new api.posts.getAllPosts(this._apiKey);
        wpGetAllPostsSvc.execute(myPostsQuery, null, (data: any) =>
        {
            console.log("Recent Posts (count): " + data.posts.length);
            event.sender.send("app.view.myPosts", data.posts);
        });
    }

}

export { service };
export { model };
export { api };
