import eeJson = require('./eeJson');
class attachmentFile extends eeJson
{
    title: string = "";
    caption: string= "";
    width: string= "";
    height: string= "";
    rawContent: any = "";
}
export = attachmentFile;
