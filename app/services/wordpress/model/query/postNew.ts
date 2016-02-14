export module wordpress.model.posts
{
    export class postCreate
    {
         http_envelope: boolean;
         pretty: boolean;
         meta: string;
         fields: string;
         callback : string;
         context : string;
         site_visibility: string;
    }
}
