import base = require('./base');
import wmq = require('../model/query/mySites');
import wmr = require('../model/response/mySite');
const fetch = require('node-fetch');
const queryString = require('querystring');

export module wordpress.api.sites
{

    export class getMySites extends base.query<wmq.wordpress.model.query.mySites, any, Array<wmr.wordpress.model.response.mySite>>
    {
        static endPoint: string = "https://public-api.wordpress.com/rest/v1.1/me/sites";

        constructor(apiToken: string)
        {
            super(apiToken, "GET", getMySites.endPoint);
        }

        execute(query: wmq.wordpress.model.query.mySites, request: any, callback: (json: Array<wmr.wordpress.model.response.mySite>)=> void)
        {
            super.execute(query, request, callback);
        }
    }
}
