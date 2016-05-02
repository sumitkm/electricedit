/// <reference path="../../model/eeJson.ts" />

/// <amd-dependency path="text!./quill-editor.html"/>
/// <amd-dependency path="quill" />

import * as ko from "knockout";

//var ko = <KnockoutStatic>require("knockout");
export var Quill = require("quill");
export var template = require("text!./quill-editor.html");
import eeJson = require("../../model/eeJson");
import attachmentFile = require("../../model/attachmentFile");

export class viewModel {
    private editor: QuillStatic;
    private currentLocation: KnockoutObservable<number> = ko.observable<number>(0);
    private file: KnockoutObservable<eeJson> = ko.observable<eeJson>(new eeJson());
    subscriptions = [];

    constructor(params: any) {
        this.initTabs();

        if (params.file != null) {
            console.log('File loaded');
            this.file = params.file;
        }

        this.subscriptions.push(this.file.subscribe((newValue) => {
            this.editor.setHTML(this.file().content());
        }));

        this.editor = new Quill('#editor', {
            modules:
            {
                "toolbar": { container: "#toolbar" }
            },
            theme: 'snow'
        });

        this.editor.on('text-change', this.textChanged);
        ipcRenderer.on("paste.html", this.onPasteHtml);
        ipcRenderer.on('app.File.Attachment.Created', this.onAttachmentCreated);

        this.editor.setHTML(this.file().content());
    }

    private initTabs() {
        //this.tabs.push(new App.Ui.Components.TabStrip.Model( "HTML Preview", false ));
    }

    private textChanged = (delta, source) =>
    {
        this.file().content (this.editor.getHTML());
        this.file().modified (true);
        var range = this.editor.getSelection();
        var position = this.editor.getLength();
        if(range !=null)
        {
            position = range.end;
        }
        this.currentLocation(position);
    }

    private onPasteHtml = (event, data) =>
    {
        var range = this.editor.getSelection();
        this.editor.updateContents({ ops: [ { retain: range.end }, { insert: data }]});
    }

    private onAttachmentCreated = (event, data: any) =>
    {
        var newAttachment = attachmentFile.fromJS(data);

        console.log(JSON.stringify(data));
        var existing = ko.utils.arrayFirst(this.file().media(), attach => attach.fileName == data.fileName);
        if(existing != null)
        {
            this.file().media.remove(existing);
        }
        this.file().media().push(newAttachment);
        this.editor.insertEmbed(this.currentLocation(), "image", data.fileName);
    }

    public tabChangedEvent = (data: App.Ui.Components.TabStrip.Model) => {
        this.file().content(this.editor.getHTML());
    }

    public getHtml = () => {
        window.console.debug();
    }

    public saveFile = () => {
        ipcRenderer.send('app.File.Save', this.file());
    }

    public dispose() {
        if(this.subscriptions!=null)
        {
            for (let i = 0; i < this.subscriptions.length; i++) {
                this.subscriptions[i].dispose();
            }
        }
    }
}
