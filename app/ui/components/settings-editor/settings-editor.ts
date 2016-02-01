/// <amd-dependency path="text!./settings-editor.html" />
/// <amd-dependency path="./settings-editor-model"/>

import ko = require("knockout");
import vm = require("./settings-editor-model");
export var template = require("text!./settings-editor.html");

export class viewModel
{
    dataSource : KnockoutObservable<vm.editorSettings> = ko.observable(new vm.editorSettings());
    constructor(params: any)
    {

    }
}
