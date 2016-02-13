module wordpress.api.base
{
    const queryString = require('querystring');
    const fetch = require('require-fetch');

    export class query<Q, R, S>
    {
        public apiKey: string = "";
        public url: string = "";
        public requestType: string= "";
        public header: any;

        constructor(apiKey: string, requestType: string, url: string)
        {
            this.apiKey = apiKey;
            this.url = url;
            this.requestType = requestType;
            this.header  = <any>{
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorization': 'Bearer '+ this.apiKey
            };
        }

        public execute(query: Q, request: R): S
        {
            return fetch(this.url, {
                method: 'POST',
                headers: this.header,
                body: queryString.stringify(request)
            }).then(res => {
                console.log(JSON.stringify(res, null, 3));
                return res.json();
            });
        }
    }
}
export = wordpress.api.base;
