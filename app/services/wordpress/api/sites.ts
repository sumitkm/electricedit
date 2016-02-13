import base = require('./base');
import wmq = require('../model/query/mySites');
import wmr = require('../model/response/mySite');

module wordpress.api.sites
{
    const fetch = require('require-fetch');
    const queryString = require('querystring');

    export class getMySites extends base.query<wmq.wordpress.model.query.mySites, any, wmr.wordpress.model.response.mySite>
    {
        static endPoint: string = "https://public-api.wordpress.com/rest/v1.1/me/sites";

        constructor(apiToken: string)
        {
            super(apiToken, "GET", getMySites.endPoint);
        }

        execute(query: wmq.wordpress.model.query.mySites, request: any) : wmr.wordpress.model.response.mySite
        {
            return super.execute(query, request);
        }
    }
}
export = wordpress.api.sites;
