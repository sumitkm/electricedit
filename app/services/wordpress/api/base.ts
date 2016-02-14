module wordpress.api.base
{
    const queryString = require('querystring');
    const fetch = require('node-fetch');

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
                'Authorization': 'Bearer '+ this.apiKey
            };
        }

        public execute(query: Q, request: R, callback: (S) => void)
        {
            try
            {
                return fetch(this.url, {
                    method: this.requestType,
                    headers: this.header,
                    body: queryString.stringify(request)
                }).then(res => {
                    return res.json();
                }).then((json: S) =>{
                    callback(json);
                });
            }
            catch(err)
            {
                console.log("FAILED: " + err);
            }
            return null;
        }
    }
}
export = wordpress.api.base;
