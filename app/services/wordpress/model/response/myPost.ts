export module wordpress.model.response
{
    export class myPost
    {
        ID: number;
        site_ID: number;
        author: any;
        date: Date;
        modified: Date;
        title: string;
        URL: string;
        short_URL: string;
        content: string;
        excerpt: string;
        slug: string;
        guid: string;
        status: string;
    }
}
