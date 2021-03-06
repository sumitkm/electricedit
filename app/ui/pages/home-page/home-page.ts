/// <amd-dependency path="text!./home-page.html" />

import { QuillEditorParams as QuillEditorParams } from "../../components/quill-editor/quill-editor-params";
import { Menus as Menu } from "../../menus/menus";
import * as SettingsEditorModel from "../../components/settings-editor/settings-editor-model";
import * as ko from "knockout";
import MySite = require("../../model/mySite");
import MyPost = require("../../model/myPost");
import eeJson = require("../../model/eeJson");
import category = require("../../model/category");

var menu = remote.Menu;
export var template = require("text!./home-page.html");

export class viewModel
{
    printPreview : KnockoutObservable<boolean> = ko.observable<boolean>(false);
    previewHtml: KnockoutObservable<string> = ko.observable<string>("");
    editorParams: any;
    eeJsonVm: KnockoutObservable<eeJson> = ko.observable<eeJson>(new eeJson());
    settingsEditorModel = ko.observable<any>();
    mySites: KnockoutObservableArray<MySite> = ko.observableArray<MySite>([]);
    myRecentPosts: KnockoutObservableArray<MyPost> = ko.observableArray<MyPost>([]);
    imageData: KnockoutObservable<string> = ko.observable("");
    separatorElement : any;
    isDragging: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    separatorVisible: KnockoutObservable<boolean> = ko.observable<boolean>(true);
    previousSidePanelWidth: KnockoutObservable<number> = ko.observable<number>(0);

    constructor()
    {
        this.editorParams = new QuillEditorParams();
        this.setupEventHandlers();
        ipcRenderer.send('app.Settings.Load');
        ipcRenderer.send('asynchronous-message', "Renderer loaded!");

        var menus = new Menu();
        var currentMenuTemplate = menu.buildFromTemplate(menus.menuTemplate);
        menu.setApplicationMenu(currentMenuTemplate);

        $(document).ready(this.initJquery);
    }

    private initJquery = () =>
    {
        $("#separator").on("mousedown", (event) => {
            this.isDragging(true);
            //console.log("x:" + event.pageX + ",y:" + event.pageY);
        });

        $(document).on("mouseup", (event) => {
            this.isDragging(false);
        });

        $(document).on("click", (event) => {
            this.isDragging(false);
        });

        $(document).on("mousemove", (event) => {
            if(this.isDragging() == true)
            {
                console.log("x:" + event.pageX + ",y:" + event.pageY);
                this.setSidePanelWidth(event.pageX);
            }
        });
    }

    onKeyPress = (event) => {
        console.log(event);
    }

    private setSidePanelWidth = (width: number) => {
        $(".side-panel").css("width", width);
        $(".separator").css("left", width);
        $(".editor-container").css("left", width);
        if(width != 0)
        {
            this.previousSidePanelWidth(width);
        }
    }

    private setupEventHandlers = () => {
        ipcRenderer.on('app.Settings.Loaded', (event, data) =>
        {
            this.settingsEditorModel(SettingsEditorModel.editorSettings.fromJS(data));
            if (this.settingsEditorModel().autoReopen() == true && this.settingsEditorModel().lastOpenFile() != "")
            {
                ipcRenderer.send('app.File.Load', this.settingsEditorModel().lastOpenFile());
                ipcRenderer.send('menu.View.GetMySites');
            }
        });

        ipcRenderer.on('app.side-panel.hide', (event, data) =>{
            this.hideSidePanel();
        });

        ipcRenderer.on('menu.View.Settings', (event, data) =>
        {
            $('#settings').modal('show');
        });

        ipcRenderer.on('menu.file.opened', (event, data) =>
        {
            this.settingsEditorModel().lastOpenFile(data.fileName);
            this.eeJsonVm(eeJson.fromJS(data));
            console.log("EEJSON LOADED! \r\n");
        });

        ipcRenderer.on('menu.File.Save', (event, data) =>
        {
            if (this.eeJsonVm().modified)
            {
                this.saveFile();
                this.eeJsonVm().modified(false);
            }
        });

        ipcRenderer.on('menu.File.OnNew', (event, data) =>
        {
            ipcRenderer.send("app.File.New", ko.toJS(this.eeJsonVm));
        });

        ipcRenderer.on('menu.File.Newed', (event, data) =>
        {
            this.eeJsonVm().fileName('');
            this.eeJsonVm().content('');
            this.eeJsonVm().title('');
            this.eeJsonVm().postId('');
            this.eeJsonVm().siteId('');
            this.eeJsonVm().urlSlug('');
        });

        ipcRenderer.on('app.File.Created', (event, data) =>
        {
            console.log('File created: ' + data.filename)
            this.eeJsonVm().fileName = data.filename;
        });

        ipcRenderer.on('app.View.ShowPostBlog', (event, data) =>
        {
            ko.utils.arrayPushAll<MySite>(this.mySites, data);
            this.showSidePanel();
        });

        ipcRenderer.on("app.view.myPosts", (event, data) => {
            this.myRecentPosts.removeAll();
            ko.utils.arrayPushAll<MyPost>(this.myRecentPosts, data);
        });

        ipcRenderer.on("app.View.PostedSuccessfully", (event, data)=>
        {
            this.eeJsonVm().postId(data.ID);
            this.eeJsonVm().siteId(data.site_ID);
            this.saveFile();
        });

        ipcRenderer.on("app.View.UpdatedSuccessfully", (event, data)=>
        {
            this.eeJsonVm().postId(data.ID);
            this.eeJsonVm().siteId(data.site_ID);
            this.saveFile();
        });

        ipcRenderer.on("paste.image", (event, data)=>
        {
            if(data!=null)
            {
                console.log(data.length);
                
                this.imageData(data);
                $('#saveAttachments').modal('show');
            }
        });

        ipcRenderer.on("app.view.post.categoryadded", (event, data)=>{
            console.log("app.view.post.categoryadded"  + JSON.stringify(data, null, 2));
            if(data != null)
            {
                this.eeJsonVm().categories.push(category.fromJS(data));
            }
        });

        ipcRenderer.on("app.view.post.categoryremoved", (event, data)=>{
            console.log("app.view.post.categoryremoved" + JSON.stringify(data, null, 2));
            // if(data != null)
            // {
            //     this.eeJsonVm().categories.push(category.fromJS(data));
            // }
        });

        ipcRenderer.on("menu.File.OnPrint", (event)=>{
            console.log("menu.File.OnPrint");
            if(this.printPreview() != true)
            {
                this.printPreview(true);
                this.previewHtml(this.eeJsonVm().content());
                ipcRenderer.send("app.File.PrintPreview");
            }
            else
            {
                this.printPreview(false);
            }
        });
    }

    private hideSidePanel = () =>
    {
        this.setSidePanelWidth(0);
        this.separatorVisible(false);
    }

    private showSidePanel = () =>
    {
        this.setSidePanelWidth(this.previousSidePanelWidth());
        this.separatorVisible(true);
    }
    public saveFile = () =>
    {
        ipcRenderer.send('app.File.Save', ko.toJS(this.eeJsonVm));
        $('#saveAttachments').modal('hide');
    }
}
