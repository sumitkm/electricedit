import ko = require("knockout");

class currentFile
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
}
export = currentFile;
