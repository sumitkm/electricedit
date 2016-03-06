class eeJson 
{
    fileName: string;
    content: string = "";
    title: string = "";
    postId: string = "";
    siteId: string = "";
    urlSlug: string = "";
    modified: boolean = false;
    type: string="";
    media : Array<string> = [];
    media_attrs: Array<any> = [];
}
export = eeJson;
