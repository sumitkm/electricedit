/// <reference path="../../interop.d.ts" />
///<amd-dependency path="text!./home-page.html" />
///<amd-dependency path="ui/components/quill-editor/quill-editor-params"/>
///<amd-dependency path="ui/menus/menus"/>

var QuillEditor = require("ui/components/quill-editor/quill-editor-params");
var ko = <KnockoutStatic>require("knockout");
var menuUi = require("ui/menus/menus");
export var template = require("text!./home-page.html");

export class viewModel {

    title: KnockoutObservable<string> = ko.observable<string>("Electric Edit");
    editorParams: any;

    constructor() {
        this.editorParams = new QuillEditor.QuillEditorParams();
        ipcRenderer.send('asynchronous-message', "Rendered loaded!");
        var Menu = remote.Menu;

        var menus = new menuUi.menus();
        var currentMenuTemplate = Menu.buildFromTemplate(menuUi.menuTemplate);
        Menu.setApplicationMenu(currentMenuTemplate);
    }
}
