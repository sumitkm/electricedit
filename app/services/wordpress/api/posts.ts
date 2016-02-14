import base = require('./base');
import wmq = require('../model/query/postNew');
import wmr = require('../model/request/postNew');
import wms = require('../model/response/newPost');

module wordpress.api.posts
{
    export class createNewPost extends base.query<any, any, any>
    {
        static endPoint = "https://public-api.wordpress.com/rest/v1.1/sites/$site/posts/new";
        constructor(apiKey: string, siteId: string)
        {
            super(apiKey, "POST", createNewPost.endPoint);
            this.url.replace('$site', siteId)
        }

        execute(query: wmq.wordpress.model.posts.postCreate, request: any, callback: (json: Array<wms.wordpress.model.response.newPost>)=> void)
        {

        }
    }
}
export = wordpress.api.posts;
