/// <reference path="../../interop.d.ts" />
/// <reference path="../../typings/tsd.d.ts"/>
///<amd-dependency path="text!./home-page.html" />
///<amd-dependency path="ui/components/quill-editor/quill-editor-params"/>
///<amd-dependency path="ui/menus/menus"/>
///<amd-dependency path="ui/components/settings-editor/settings-editor-model"/>

var editorSettings = require("ui/components/settings-editor/settings-editor-model").editorSettings;
var QuillEditor = require("ui/components/quill-editor/quill-editor-params");
import ko = require("knockout");
var menuUi = require("ui/menus/menus");
var Menu = remote.Menu;

export var template = require("text!./home-page.html");

export class viewModel {

    editorParams: any;
    currentFile: KnockoutObservable<any> = ko.observable({ fileName: '', content: '' });
    settingsEditorModel = ko.observable<any>();
    constructor() {
        this.editorParams = new QuillEditor.QuillEditorParams();

        ipcRenderer.on('app.Settings.Loaded', (event, data) => {
            this.settingsEditorModel(editorSettings.fromJS(data));
            if(this.settingsEditorModel().autoReopen()==true)
            {
                ipcRenderer.send('app.File.Load', this.settingsEditorModel().lastOpenFile());
            }
        });

        ipcRenderer.send('app.Settings.Load');
        ipcRenderer.send('asynchronous-message', "Renderer loaded!");

        var menus = new menuUi.menus();
        var currentMenuTemplate = Menu.buildFromTemplate(menuUi.menuTemplate);
        Menu.setApplicationMenu(currentMenuTemplate);

        ipcRenderer.on('menu.View.Settings', (event, data) => {
            $('#settings').modal('show');
        });

        ipcRenderer.on('menu.file.opened', (event, data) => {
            console.log('home-page:' + data.fileName);
            this.currentFile(data);
        });
    }
}
