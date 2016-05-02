/// <amd-dependency path="text!./tree-view.html" />

import * as ko from "knockout";
import treeNodeVm = require("../tree-node/treeNodeVm");
export var template = require("text!./tree-view.html");

export class viewModel
{
    dataSource : KnockoutObservableArray<treeNodeVm> = ko.observableArray<treeNodeVm>([]);
    constructor(params)
    {
        console.log("DataSource"+ params.dataSource().length);
        this.dataSource = params.dataSource;
    }
}
