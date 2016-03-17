import ko = require("knockout");

class category
{
    ID: KnockoutObservable<number> = ko.observable<number>(-1);
    name: KnockoutObservable<string> = ko.observable<string>("");
    slug: KnockoutObservable<string> = ko.observable<string>("");
    description: KnockoutObservable<string> = ko.observable<string>("");
    post_count: KnockoutObservable<number> = ko.observable<number>(0);
    parent: KnockoutObservable<number> = ko.observable<number>(-1);
    meta: KnockoutObservable<any> = ko.observable<any>();

    public static fromJS = (data) : category =>
    {
        var newCat = new category();
        newCat.ID(data.ID != null? data.ID: -1);
        newCat.name(data.name != null? data.name : "");
        newCat.slug(data.slug != null ? data.slug : "");
        newCat.description(data.description != null ? data.description : "");
        newCat.post_count(data.post_count != null ? data.post_count : 0);
        newCat.parent (data.parent !=null ? data.parent : -1);
        newCat.meta(data.meta != null? data.meta: null);
        return newCat;
    }
}
export = category;
