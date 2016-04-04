import attachmentFile = require("./attachmentFile");

class eeJson
{
    fileName: string;
    content: string = "";
    title: string = "";
    postId: string = "";
    siteId: string = "";
    urlSlug: string = "";
    type: string="";
    media : Array<attachmentFile> = [];
    categories: Array<category> = [];
}
export = eeJson;
