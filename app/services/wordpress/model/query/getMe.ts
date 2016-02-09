export module wordpress.model.query
{
    export interface getMySites{
         http_envelope?: boolean;
         pretty?: boolean;
         meta?: string;
         fields?: string;
         callback? : string;
    }
}
