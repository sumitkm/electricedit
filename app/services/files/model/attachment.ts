import { electricEditFile } from "./electricedit-file";

class attachment implements electricEditFile
{
    fileName: string = "";
    contentString: string = "";
    contentBinary: any;
    title: string = "";
    caption: string = "";
    serverId: string = "";
    serverUrl: string = "";
    width: string = "";
    height: string = "";
    isModified: boolean = false;
}

export { attachment };
