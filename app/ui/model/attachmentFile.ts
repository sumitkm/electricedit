import ko = require("knockout");

class attachmentFile
{
    fileName: KnockoutObservable<string>= ko.observable<string>("");
    title: KnockoutObservable<string>= ko.observable<string>("");
    caption: KnockoutObservable<string>= ko.observable<string>("");
    serverId: KnockoutObservable<string>=ko.observable<string>("");
    serverUrl: KnockoutObservable<string>=ko.observable<string>("");
    width: KnockoutObservable<string>= ko.observable<string>("");
    height: KnockoutObservable<string>= ko.observable<string>("");
    rawContent: KnockoutObservable<any> = ko.observable<any>("");

    public static fromJS = (data) : attachmentFile =>
    {
        var newAttachment = new attachmentFile();
        newAttachment.fileName(data.fileName != null? data.fileName: "");
        newAttachment.title(data.title != null? data.title : "");
        newAttachment.caption(data.caption != null ? data.caption : "");
        newAttachment.serverId(data.serverId != null ? data.serverId : "");
        newAttachment.serverUrl(data.serverUrl != null ? data.serverUrl : "");
        newAttachment.width (data.width !=null ? data.width : "");
        newAttachment.height(data.height != null? data.height: "");
        newAttachment.rawContent(data.rawContent != null? data.rawContent : "");
        return newAttachment;
    }
}
export = attachmentFile;
