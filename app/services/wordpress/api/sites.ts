import base = require('./base');
import queries = require('../model/query/query');
import responses = require('../model/response/response');

const fetch = require('node-fetch');
const queryString = require('querystring');

export module wordpress.api.sites
{
    export class getMySites extends base.query<
        queries.wordpress.model.query.mySites,
        any,
        Array<responses.wordpress.model.response.mySite>>
    {
        static endPoint: string = "https://public-api.wordpress.com/rest/v1.1/me/sites";

        constructor(apiToken: string)
        {
            super(apiToken, "GET", getMySites.endPoint);
        }

        execute(
            query: queries.wordpress.model.query.mySites,
            request: any,
            callback: (json: Array<responses.wordpress.model.response.mySite>)=> void)
        {
            super.execute(query, request, (data: any)=>
            {
                callback(<Array<responses.wordpress.model.response.mySite>>data.sites);
            });
        }
    }

    export class getCategories extends base.query<
        any,
        any,
        Array<responses.wordpress.model.response.category>>
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
            callback: (results: Array<responses.wordpress.model.response.category>)=>void)
        {
            super.execute( query, request, (data: any) =>
            {
                callback(<Array<responses.wordpress.model.response.category>>data.categories);
            });
        }
    }

    export class getTags extends base.query<
        any,
        any,
        Array<responses.wordpress.model.response.tag>>
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
            callback: (results: Array<responses.wordpress.model.response.tag>)=>void)
        {
            super.execute( query, request, (data: any) =>
            {
                callback(<Array<responses   .wordpress.model.response.tag>>data.categories);
            });
        }
    }
}
