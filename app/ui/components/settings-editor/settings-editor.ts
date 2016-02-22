/// <amd-dependency path="text!./settings-editor.html" />
/// <amd-dependency path="./settings-editor-model"/>

import ko = require("knockout");
import vm = require("./settings-editor-model");
export var template = require("text!./settings-editor.html");

export class viewModel
{
    id : KnockoutObservable<string> = ko.observable(new Date().getUTCMilliseconds().toString());
    dataSource : KnockoutObservable<vm.editorSettings> = ko.observable(new vm.editorSettings());
    constructor(params: any)
    {
        if(params.settings != null && ko.isObservable(params.settings))
        {
            this.dataSource = params.settings;
        }
        if(params.id != null)
        {
            this.id(params.id);
        }
    }

    saveChanges = (event, args) =>
    {
        ipcRenderer.send('settings.App.Save', this.dataSource().toJS());
        $('#' + this.id()).modal('hide');
    }
}
