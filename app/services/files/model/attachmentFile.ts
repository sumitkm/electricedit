import eeJson = require('./eeJson');
class attachmentFile extends eeJson
{
    fileName: string = "";
    title: string = "";
    caption: string = "";
    serverId: string = "";
    serverUrl: string = "";
    width: string = "";
    height: string = "";
    rawContent: string = "";
}
export = attachmentFile;
