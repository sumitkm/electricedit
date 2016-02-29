        import ko = require("knockout");

class attachmentFile
{
    fileName: KnockoutObservable<string>= ko.observable<string>("");
    alt: KnockoutObservable<string>= ko.observable<string>("");
    title: KnockoutObservable<string>= ko.observable<string>("");
    width: KnockoutObservable<string>= ko.observable<string>("");
    height: KnockoutObservable<string>= ko.observable<string>("");
}
export = attachmentFile;
