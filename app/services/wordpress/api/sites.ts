import * as api from "./api";
import * as model from "../model/model";

export class getMySites extends api.base.query<
    model.query.mySites,
    any,
    Array<model.response.mySite>>
{
    static endPoint: string = "https://public-api.wordpress.com/rest/v1.1/me/sites";

    constructor(apiToken: string)
    {
        super(apiToken, "GET", getMySites.endPoint);
    }

    execute(
        query: model.query.mySites,
        request: any,
        callback: (json: Array<model.response.mySite>)=> void)
    {
        super.execute(query, request, (data: any)=>
        {
            callback(<Array<model.response.mySite>>data.sites);
        });
    }
}

export class getCategories extends api.base.query<
    any,
    any,
    Array<model.response.category>>
{
    static endPoint: string = "https://public-api.wordpress.com/rest/v1.1/sites/$site/categories";

    constructor(apiToken: string, siteId: string)
    {
        super(apiToken, "GET", getCategories.endPoint);
        super.setUrl(getCategories.endPoint.replace('$site', siteId));
    }

    execute(
        query: any,
        request: any,
        callback: (results: Array<model.response.category>)=>void)
    {
        super.execute( query, request, (data: any) =>
        {
            callback(<Array<model.response.category>>data.categories);
        });
    }
}

export class getTags extends api.base.query<
    any,
    any,
    Array<model.response.tag>>
{
    static endPoint: string = "https://public-api.wordpress.com/rest/v1.1/sites/$site/tags";

    constructor(apiToken: string, siteId: string)
    {
        super(apiToken, "GET", getCategories.endPoint);
        super.setUrl(getCategories.endPoint.replace('$site', siteId));
    }

    execute(
        query: any,
        request: any,
        callback: (results: Array<model.response.tag>)=>void)
    {
        super.execute( query, request, (data: any) =>
        {
            callback(<Array<model.response.tag>>data.categories);
        });
    }
}
