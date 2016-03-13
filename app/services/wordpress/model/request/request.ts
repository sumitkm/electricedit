export module wordpress.model.request
{
    export class postNew
    {
        date: string;
        title: string;
        content: string;
        excerpt: string;
        slug: string;
        author: string;
        publicize: boolean;
        publicize_message: string;
        status: string;
        sticky: boolean;
        password: string;
        parent: number;
        type: string;
        categories: Array<string>;
        tags: Array<string>;
        format: string;
        featured_image: string;
        media: Array<any>;
        media_urls: Array<string>;
        media_attrs: Array<any>;
        metadata: Array<any>;
        discussion: any;
        likes_enabled: boolean;
        sharing_enabled: boolean;
        menu_order: number;
        page_template: string;
    }
}
