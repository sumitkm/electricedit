import ko = require("knockout");

class treeNodeVm
{
    text: KnockoutObservable<string> = ko.observable<string>("");
    showCheckBox: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    dataSource : KnockoutObservable<any> = ko.observable<any>();
    children : KnockoutObservableArray<treeNodeVm> = ko.observableArray<treeNodeVm>([]);
    padding: KnockoutObservable<number> = ko.observable<number>(5);
    checked: KnockoutObservable<boolean> = ko.observable<boolean>(false);
}

export = treeNodeVm;
