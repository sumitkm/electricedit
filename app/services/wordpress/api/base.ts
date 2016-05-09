import * as queryString from "querystring";

export class query<Q, R, S>
{
    public apiKey: string = "";
    public url: string = "";
    public requestType: string= "";
    public header: any;
    public contentType: string = "application/x-www-form-urlencoded";

    constructor(apiKey: string, requestType: string, url: string)
    {
        this.apiKey = apiKey;
        this.url = url;
        this.requestType = requestType;
        this.header  = <any>{
            'Accept': 'application/json',
            'Content-Type': this.contentType,
            'Authorization': 'Bearer ' + this.apiKey
        };
    }

    public setUrl(url: string)
    {
        this.url = url;
    }

    public execute(query: Q, request: R, callback: (response: S)=>void)
    {
        try
        {
            console.log(this.url);
            var fetch = require("node-fetch");
            return fetch(this.url, {
                method: this.requestType,
                headers: this.header,
                body: queryString.stringify(request)
            }).then((res: any) => {
                return res.json();
            }).then((json: S) =>{
                callback(json);
            });
        }
        catch(err)
        {
            console.error("FAILED: " + err);
        }
        return null;
    }
}
