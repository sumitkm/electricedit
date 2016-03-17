///<amd-dependency path="text!./tree-view.html" />

import ko = require("knockout");
import treeNodeVm = require("../tree-node/treeNodeVm");
export var template = require("text!./tree-view.html");

export class viewModel
{
    dataSource : KnockoutObservableArray<treeNodeVm> = ko.observableArray<treeNodeVm>([]);
    constructor(params)
    {
        ko.utils.arrayPushAll(this.dataSource(), params.dataSource);
    }


}
