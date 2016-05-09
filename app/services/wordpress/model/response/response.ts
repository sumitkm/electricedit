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

export class mySite
{
    ID: number;
    name: string;
    description: string;
    url: string;
    visible: boolean;
    is_private: boolean;
}

export class newPost
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

export class category
{
    ID: number;
    name: number;
    slug: string;
    description: string;
    post_count; number;
    parent: number;
    meta: meta;
}

export class tag
{
    ID: number;
    name: string;
    slug: string;
    description: string;
    post_count: number;
    meta: meta;
}

export class meta
{
    links: links;
}

export class links
{
    self: string;
    help: string;
    site: string;
}
