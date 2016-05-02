/// <amd-dependency path="text!./settings-editor.html" />
/// <amd-dependency path="./settings-editor-model"/>

import * as ko from "knockout";
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
    addWordpressAccount = () =>
    {
        var newWpAccount = new vm.oAuth2Group();
        newWpAccount.groupName = ko.observable("Wordpress");
        newWpAccount.accessToken = ko.observable("");
        newWpAccount.oAuthClientId = ko.observable("");
        newWpAccount.oAuthClientSecret = ko.observable("");
        newWpAccount.redirectUrl = ko.observable("https://github.com/sumitkm/electricedit");
        newWpAccount.baseUrl = ko.observable("https://public-api.wordpress.com/");
        newWpAccount.tokenUrl = ko.observable("oauth2/token");
        newWpAccount.authorizeUrl = ko.observable("oauth2/authorize");
        newWpAccount.authenticateUrl = ko.observable("oauth2/authenticate");
        this.dataSource().oAuth2Groups.push(newWpAccount);
    }
}
