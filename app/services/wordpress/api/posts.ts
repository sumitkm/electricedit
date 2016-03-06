import base = require('./base');
import wmq = require('../model/query/postNew');
import wmr = require('../model/request/postNew');
import wms = require('../model/response/newPost');
const fetch = require('node-fetch');
const queryString = require('querystring');

export module wordpress.api.posts {
    export class createNewPost extends
        base.query<wmq.wordpress.model.query.postNew,
        wmr.wordpress.model.request.postNew,
        wms.wordpress.model.response.newPost>
    {
        static endPoint = "https://public-api.wordpress.com/rest/v1.1/sites/$site/posts/new";
        constructor(apiKey: string, siteId: string) {
            super(apiKey, "POST", createNewPost.endPoint);
            super.setUrl(createNewPost.endPoint.replace('$site', siteId));
        }

        execute(
            query: wmq.wordpress.model.query.postNew,
            request: any,
            callback: (json: Array<wms.wordpress.model.response.newPost>) => void) {
            super.execute(query, request, callback);
        }
    }

    export class getAllPosts extends
        base.query<wmq.wordpress.model.query.postNew,
        wmr.wordpress.model.request.postNew,
        wms.wordpress.model.response.newPost>
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
        constructor(apiKey: string, siteId: string, postId: string) {
            super(apiKey, "POST", updatePost.endPoint);
            super.setUrl(updatePost.endPoint.replace("$site", siteId).replace("$post_ID", postId));
        }

        execute(query: any, request: any, callback: (json: any) => void) {
            console.log(this.url);
            this.roundPants(query, request, callback);
        }

        squarePants = (query: any, request: any, callback: (json: any) => void) => {
            var https = require('https');
            var querystring = require('querystring');
            var postData = querystring.stringify(request);

            var options = {
                hostname: 'public-api.wordpress.com',
                port: 443,
                path: '/rest/v1.1/sites/107021760/posts/9',
                method: 'POST',
                headers: this.header
            };

            var req = https.request(options, (res) => {
                console.log('STATUS:' + res.statusCode);
                console.log('HEADERS:' + JSON.stringify(res.headers));
                var responseData = [];
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    responseData.push(chunk);
                });
                res.on('end', () => {
                    console.log('RESPONSE BODY (RAW):' + responseData);
                    console.log('No more data in response.')
                    callback(responseData);
                })
            });

            req.on('error', (e) => {
                console.log('problem with request:' + e.message);
            });

            // write data to request body
            req.write(postData);
            req.end();
        }

        roundPants = (query: any, req: any, callback: (json: any) => void) =>
        {
            var FormData = require('form-data');
            var fs = require('fs');
            var request = require('request');
            var formData = {
              'media[]': fs.createReadStream(req.media[0]),
              'attrs[0][caption]' : 'Blah',
              'attrs[1][title]' : 'Blah Blah'
            };
            request.post(
                {
                    url:'https://public-api.wordpress.com/rest/v1.1/sites/107021760/media/new',
                    hostname: 'public-api.wordpress.com',
                    port: 443,
                    path: '/rest/v1.1/sites/107021760/posts/9',
                    method: 'POST',
                    headers: this.header,
                    formData: formData
                },
                function optionalCallback(err, httpResponse, body)
                {
                    if (err)
                    {
                        return console.error('upload failed:', err);
                    }
                    console.log('Upload successful!  Server responded with:', body);
                }
            );
        }
    }
}
