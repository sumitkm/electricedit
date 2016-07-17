import { attachment } from "./attachment";
import { electricEditFile } from "./electricedit-file";

class electricEditJson implements electricEditFile
{
    fileName: string;
    contentString: string = "";
    contentBinary: any = null;
    title: string = "";
    postId: string = "";
    siteId: string = "";
    urlSlug: string = "";
    type: string="";
    media : Array<attachment> = [];
    categories: Array<category> = [];
    isModified: boolean = false;
}
export { electricEditJson };
