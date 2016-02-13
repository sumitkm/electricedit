import base = require('./base');

module wordpress.api.posts
{
    export class createNewPost extends base.query<any, any, any>
    {
        static endPoint = "https://public-api.wordpress.com/rest/v1.1/sites/$site/posts/new";
        constructor(apiKey: string, siteId: string)
        {
            super(apiKey, createNewPost.endPoint);
            this.url.replace('$site', siteId)
        }
    }
}
export = wordpress.api.posts;
