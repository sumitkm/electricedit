import ko = require("knockout");

class treeNodeVm
{
    text: KnockoutObservable<string> = ko.observable<string>("");
    showCheckBox: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    dataSource : KnockoutObservable<any> = ko.observable<any>();
    children : KnockoutObservable<treeNodeVm> = ko.observable<treeNodeVm>();
    padding: KnockoutObservable<number> = ko.observable<number>(5);
}

export = treeNodeVm;
