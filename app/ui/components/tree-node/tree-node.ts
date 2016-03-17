/// <amd-dependency path="text!./tree-node.html" />

import ko = require("knockout");
import treeNodeVm = require("./treeNodeVm");
export var template = require("text!./tree-node.html");

class viewModel
{
    node : KnockoutObservable<treeNodeVm> = ko.observable<treeNodeVm>();
    constructor(params: any)
    {
        if(params.node != null)
        {
            this.node(params.dataSource);
        }
    }
}
