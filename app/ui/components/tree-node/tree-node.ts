/// <amd-dependency path="text!./tree-node.html" />

import ko = require("knockout");
import treeNodeVm = require("./treeNodeVm");

export var template = require("text!./tree-node.html");

export class viewModel
{
    public dataSource : KnockoutObservable<treeNodeVm> = ko.observable<treeNodeVm>(new treeNodeVm());
    constructor(params)
    {
        console.log(JSON.stringify(ko.toJS(params.dataSource), null, 2));
        this.dataSource = params.dataSource;
    }

    nodeChecked = (data: treeNodeVm) =>
    {
        if(data.checked() == true)
        {
            ipcRenderer.send("app.view.post.treeview.nodecheckchanged", ko.toJS(data));
        }
        return true;
    }
}
