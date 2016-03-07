import ko = require("knockout");

class eeJson
{
    fileName: KnockoutObservable<string>=ko.observable<string>("");
    content: KnockoutObservable<string>=ko.observable<string>("");
    title: KnockoutObservable<string>=ko.observable<string>("");
    postId: KnockoutObservable<string>=ko.observable<string>("");
    siteId: KnockoutObservable<string>=ko.observable<string>("");
    urlSlug: KnockoutObservable<string>=ko.observable<string>("");
    modified: KnockoutObservable<boolean>=ko.observable<boolean>(false);
    type: KnockoutObservable<string>=ko.observable<string>("");
    media : KnockoutObservableArray<any>=ko.observableArray<any>([]);
    media_attrs: KnockoutObservableArray<any>=ko.observableArray<any>([]);

    public static fromJS(data : any)
    {
        var newJson = new eeJson();
        newJson.fileName(data.fileName);
        newJson.content(data.content);
        newJson.title(data.title);
        newJson.postId(data.postId);
        newJson.siteId(data.siteId);
        newJson.urlSlug(data.urlSlug);
        newJson.modified(data.modified);
        newJson.type(data.type);
        if(data.media!=null)
        {
            ko.utils.arrayPushAll(newJson.media(), data.media);
        }
        if(data.media_attrs !=null)
        {
            ko.utils.arrayPushAll(newJson.media_attrs(), data.media_attrs);
        }
        return newJson;
    }
}
export = eeJson;
