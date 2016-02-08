module wordpress.api.base
{
    export class query<T>
    {
        public apiKey: string = "";
        public url: string = "";

        constructor(apiKey: string, url: string)
        {
            this.apiKey = apiKey;
            this.url = url;
        }

        public execute(data: T)
        {

        }
    }
}
export = wordpress.api.base;
