import base = require('./base');
import wmq = require('../model/query/postNew');
import wmr = require('../model/request/postNew');
import wms = require('../model/response/newPost');
const fetch = require('node-fetch');
const queryString = require('querystring');

export module wordpress.api.posts
{
    export class createNewPost extends
        base.query<wmq.wordpress.model.query.postNew,
            wmr.wordpress.model.request.postNew,
            wms.wordpress.model.response.newPost>
    {
        static endPoint = "https://public-api.wordpress.com/rest/v1.1/sites/$site/posts/new";
        constructor(apiKey: string, siteId: string)
        {
            super(apiKey, "POST", createNewPost.endPoint);
            super.setUrl(createNewPost.endPoint.replace('$site', siteId));
        }

        execute(
            query: wmq.wordpress.model.query.postNew,
            request: any,
            callback: (json: Array<wms.wordpress.model.response.newPost>)=> void)
        {
            super.execute(query, request, callback);
        }
    }

    export class getAllPosts extends
        base.query<wmq.wordpress.model.query.postNew,
                wmr.wordpress.model.request.postNew,
                wms.wordpress.model.response.newPost>
    {
        static endPoint = "https://public-api.wordpress.com/rest/v1.1/me/posts";
        constructor(apiKey: string)
        {
            super(apiKey, "GET", getAllPosts.endPoint);
        }
    }
}
