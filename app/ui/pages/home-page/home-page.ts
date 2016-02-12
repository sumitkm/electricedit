/// <reference path="../../interop.d.ts" />
/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="../../model/currentFile.ts" />

///<amd-dependency path="text!./home-page.html" />
///<amd-dependency path="ui/components/quill-editor/quill-editor-params"/>
///<amd-dependency path="ui/menus/menus"/>
///<amd-dependency path="ui/components/settings-editor/settings-editor-model"/>

var editorSettings = require("ui/components/settings-editor/settings-editor-model").editorSettings;
var QuillEditor = require("ui/components/quill-editor/quill-editor-params");
import ko = require("knockout");
import CurrentFile = require("../../model/currentFile");
var menuUi = require("ui/menus/menus");
var Menu = remote.Menu;

export var template = require("text!./home-page.html");

export class viewModel
{
    editorParams: any;
    currentFile: KnockoutObservable<CurrentFile> = ko.observable({ fileName: '', content: '', modified: false });
    settingsEditorModel = ko.observable<any>();

    constructor()
    {
        this.editorParams = new QuillEditor.QuillEditorParams();

        ipcRenderer.on('app.Settings.Loaded', (event, data) =>
        {
            this.settingsEditorModel(editorSettings.fromJS(data));
            if (this.settingsEditorModel().autoReopen() == true)
            {
                ipcRenderer.send('app.File.Load', this.settingsEditorModel().lastOpenFile());
            }
        });

        ipcRenderer.send('app.Settings.Load');
        ipcRenderer.send('asynchronous-message', "Renderer loaded!");

        var menus = new menuUi.menus();
        var currentMenuTemplate = Menu.buildFromTemplate(menuUi.menuTemplate);
        Menu.setApplicationMenu(currentMenuTemplate);

        ipcRenderer.on('menu.View.Settings', (event, data) =>
        {
            $('#settings').modal('show');
        });

        ipcRenderer.on('menu.file.opened', (event, data) =>
        {
            console.log('home-page:' + data.fileName);
            this.settingsEditorModel().lastOpenFile(data.fileName);
            this.currentFile(data);
        });

        ipcRenderer.on('menu.File.Save', (event, data) =>
        {
            if (this.currentFile().modified) {
                this.saveFile();
                this.currentFile().modified = false;
            }
        });

        ipcRenderer.on('menu.File.OnNew', (event, data) =>
        {
            ipcRenderer.send("app.File.New", this.currentFile());
        });

        ipcRenderer.on('menu.File.Newed', (event, data)=>
        {
            this.currentFile({ fileName: '', content: '', modified: true });
        });

        ipcRenderer.on('app.File.Created', (event, data) =>
        {
            console.log('File created' + data.filename)
            this.currentFile().fileName = data.filename;
        });
    }

    public saveFile = () =>
    {
        ipcRenderer.send('app.File.Save', this.currentFile());
    }
}
