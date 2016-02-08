import base = require('./base');

module wordpress.api.sites {
    export class getMySites extends base.query<any>
    {
        static endPoint: string = "https://public-api.wordpress.com/rest/v1.1/me/sites";

        apiToken: string = "";
        constructor(apiToken: string) {
            super(apiToken, getMySites.endPoint);
        }
    }
}
export = wordpress.api.sites;
