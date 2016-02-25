/// <reference path="../../interop.d.ts" />
/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="../../model/currentFile.ts" />

///<amd-dependency path="text!./home-page.html" />
///<amd-dependency path="ui/components/quill-editor/quill-editor-params"/>
///<amd-dependency path="ui/menus/menus"/>
///<amd-dependency path="ui/components/settings-editor/settings-editor-model"/>
import MySite = require("../../model/mySite");
import MyPost = require("../../model/myPost");

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
    currentFile: KnockoutObservable<CurrentFile> = ko.observable(
        {
            fileName: ko.observable(''),
            content: ko.observable(''),
            modified: ko.observable(false),
            title: ko.observable(''),
            postId: ko.observable(''),
            siteId: ko.observable(''),
            urlSlug: ko.observable('')
        });
    settingsEditorModel = ko.observable<any>();
    mySites: KnockoutObservableArray<MySite> = ko.observableArray<MySite>([]);
    myRecentPosts: KnockoutObservableArray<MyPost> = ko.observableArray<MyPost>([]);
    imageData: KnockoutObservable<string> = ko.observable("");

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
            this.settingsEditorModel().lastOpenFile(data.fileName);
            var newFile =
            {
                fileName : ko.observable(data.fileName),
                content : ko.observable(data.content),
                title : ko.observable(data.title),
                postId : ko.observable(data.postId),
                siteId : ko.observable(data.siteId),
                urlSlug : ko.observable(data.urlSlug),
                modified : ko.observable(false)
            };
            this.currentFile(newFile);
        });

        ipcRenderer.on('menu.File.Save', (event, data) =>
        {
            if (this.currentFile().modified)
            {
                this.saveFile();
                this.currentFile().modified(false);
            }
        });

        ipcRenderer.on('menu.File.OnNew', (event, data) =>
        {
            ipcRenderer.send("app.File.New", ko.toJS(this.currentFile));
        });

        ipcRenderer.on('menu.File.Newed', (event, data)=>
        {
            this.currentFile().fileName('');
            this.currentFile().content('');
            this.currentFile().title('');
            this.currentFile().postId('');
            this.currentFile().siteId('');
            this.currentFile().urlSlug('');
        });

        ipcRenderer.on('app.File.Created', (event, data) =>
        {
            console.log('File created: ' + data.filename)
            this.currentFile().fileName = data.filename;
        });

        ipcRenderer.on('app.View.ShowPostBlog', (event, data)=>
        {
            ko.utils.arrayPushAll<MySite>(this.mySites, data);
            $('#postBlog').modal('show');
        });

        ipcRenderer.on("app.view.myPosts", (event, data) => {
            this.myRecentPosts.removeAll();
            ko.utils.arrayPushAll<MyPost>(this.myRecentPosts, data);
        });

        ipcRenderer.on("app.View.PostedSuccessfully", (event, data)=>
        {
            this.currentFile().postId(data.ID);
            this.currentFile().siteId(data.site_ID);
            $('#postBlog').modal('hide');
            this.saveFile();
        });

        ipcRenderer.on("app.View.UpdatedSuccessfully", (event, data)=>
        {
            this.currentFile().postId(data.ID);
            this.currentFile().siteId(data.site_ID);
            $('#postBlog').modal('hide');
            this.saveFile();
        });

        ipcRenderer.on("paste.image", (event, data)=>
        {
            console.log(data);
            if(data!=null)
            {
                this.imageData(data);
                $('#saveAttachments').modal('show');
            }
        });




    }

    public saveFile = () =>
    {
        ipcRenderer.send('app.File.Save', ko.toJS(this.currentFile));
        $('#saveAttachments').modal('hide');

    }
}
