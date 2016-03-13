import base = require('./base');
import queries = require('../model/query/query');
import requests = require('../model/request/request');
import responses = require('../model/response/response');
const fetch = require('node-fetch');
const queryString = require('querystring');

export module wordpress.api.posts {
    export class createNewPost extends
        base.query<queries.wordpress.model.query.postNew,
        requests.wordpress.model.request.postNew,
        Array<responses.wordpress.model.response.newPost>>
    {
        static endPoint = "https://public-api.wordpress.com/rest/v1.1/sites/$site/posts/new";
        constructor(apiKey: string, siteId: string) {
            super(apiKey, "POST", createNewPost.endPoint);
            super.setUrl(createNewPost.endPoint.replace('$site', siteId));
        }

        execute(
            query: queries.wordpress.model.query.postNew,
            request: requests.wordpress.model.request.postNew,
            callback: (json: Array<responses.wordpress.model.response.newPost>) => void) {
            super.execute(query, request, callback);
        }
    }

    export class getAllPosts extends
        base.query<queries.wordpress.model.query.postNew,
        requests.wordpress.model.request.postNew,
        responses.wordpress.model.response.newPost>
    {
        static endPoint = "https://public-api.wordpress.com/rest/v1.1/me/posts";
        constructor(apiKey: string) {
            super(apiKey, "GET", getAllPosts.endPoint);
        }
    }

    export class updatePost extends
        base.query<any, any, any>
    {
        static endPoint = "https://public-api.wordpress.com/rest/v1.1/sites/$site/posts/$post_ID";
        mediaUrl: string = "https://public-api.wordpress.com/rest/v1.1/sites/$site/media/new";
        constructor(apiKey: string, siteId: string, postId: string) {
            super(apiKey, "POST", updatePost.endPoint);
            this.mediaUrl = this.mediaUrl.replace("$site", siteId);
            super.setUrl(updatePost.endPoint.replace("$site", siteId).replace("$post_ID", postId));
        }

        execute(query: any, request: any, callback: (json: any) => void) {
            console.log(this.url);
            this.uploadMedia(query, request, callback);
        }

        uploadMedia = (query: any, req: any, callback: (json: any) => void) =>
        {
            var FormData = require('form-data');
            var fs = require('fs');
            var request = require('request');
            var formData = <any>{};

            for (let i = 0; i < req.media.length; i++) {
                formData['media[' + i + ']'] = <any>fs.createReadStream(req.media[i].fileName);
                formData['attrs[' + i + '][caption]'] = <any>req.media[i].caption,
                formData['attrs[' + i + '][title]'] = <any>req.media[i].title
            }

            request.post(
                {
                    url: this.mediaUrl,
                    method: 'POST',
                    headers: this.header,
                    formData: formData
                },
                (err: any, httpResponse: any, body: any) =>
                {
                    if (err)
                    {
                        return console.error('upload failed:', err);
                    }
                    console.log('Media uploaded successfully!  Server responded with:', httpResponse);
                    var media = JSON.parse(body).media;
                    for (let i = 0; i < media.length; i++)
                    {
                        req.content = req.content.replace(req.media[i].fileName, media[i].URL);
                    }
                    super.execute(query, req, callback);
                }
            );
        }
    }
}
