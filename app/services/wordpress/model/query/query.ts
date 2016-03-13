export module wordpress.model.query
{
    export class baseQuery
    {
        http_envelope: boolean;
        pretty: boolean;
        meta: string;
        fields: string;
        callback : string;
        context : string;
    }

    export class mediaNew
    {
         ID: number;
         URL: string;
         fileName: string;
         title: string;
         caption: string;
    }

    export class myPosts extends baseQuery
    {
         site_visibility: string;
    }

    export class mySites extends baseQuery
    {
         site_visibility: string;
    }

    export class postNew extends baseQuery
    {
    }
}
