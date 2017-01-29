/// <amd-dependency path="text!./quill-editor.html"/>

import * as ko from "knockout";
import * as Quill from "Quill";
import eeJson = require("../../model/eeJson");
import attachmentFile = require("../../model/attachmentFile");
export var template = require("text!./quill-editor.html");

export class viewModel {
    private editor: QuillJS.QuillStatic;
    private currentLocation: KnockoutObservable<number> = ko.observable<number>(0);
    private file: KnockoutObservable<eeJson> = ko.observable<eeJson>(new eeJson());
    private selectedLinkText: KnockoutObservable<string> = ko.observable<string>("");
    private selectedLinkHref: KnockoutObservable<string> = ko.observable<string>("");
    private selectedLinkTitle: KnockoutObservable<string> = ko.observable<string>("");
    private selectedLinkTarget: KnockoutObservable<string> = ko.observable<string>("");
    private linkEditorDialog: any;
    private range: QuillJS.RangeStatic;
    subscriptions = [];
    private toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['link'],
        ['video'],
        ['save'],

        ['clean']                                         // remove formatting button
    ];
    constructor(params: any) {
        this.initTabs();

        if (params.file != null) {
            console.log('File loaded');
            this.file = params.file;
        }

        this.editor = new Quill('#editor', {
            modules: {
                toolbar: this.toolbarOptions
            },
            theme: 'snow'
        });
        this.editor.on('text-change', this.textChanged);
        this.editor.on('selection-change', this.selectionChanged);
        ipcRenderer.on("paste.html", this.onPasteHtml);
        ipcRenderer.on('app.File.Attachment.Created', this.onAttachmentCreated);
        this.editor.pasteHTML(this.file().content(), "silent");

        this.subscriptions.push(this.file.subscribe((newValue) => {
            this.editor.pasteHTML(this.file().content(), "silent");
        }));
        var toolbar = this.editor.getModule('toolbar');

        document.querySelector('.ql-save').className += ' glyphicon glyphicon-floppy-disk';
        toolbar.addHandler('save', this.saveFile);
    }



    private setLink = (value) => {
        let newValue = "https://www.google.com";
        this.editor.format('link', newValue);
    }

    private showLinkEditor = (value) => {
        if (value) {
            let range = this.editor.getSelection();
            if (range == null || range.length == 0) return;
            let preview = this.editor.getText(range.index, range.length);
            if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
                preview = 'mailto:' + preview;
            }
            this.selectedLinkText(preview);
            this.linkEditorDialog.modal('show');
            //tooltip.edit('link', preview);
        } else {
            this.editor.format('link', false);
        }
        this.linkEditorDialog.modal('show');
    }

    private saveLinkChanges = (value) => {
        this.linkEditorDialog.modal('hide');
        this.editor.format('link', this.selectedLinkHref());
    }

    private showVimeoVideo = () => {
        //this.editor.showToolBar()
    }

    private initTabs() {
        //this.tabs.push(new App.Ui.Components.TabStrip.Model( "HTML Preview", false ));
    }

    private selectionChanged = (range: QuillJS.RangeStatic, oldRange, source) => {
        if (range) {
            this.range = range;
            if (range.length == 0) {
                console.log('User cursor is on', range.index);
            } else {
                var text = this.editor.getText(range.index, range.length);
                console.log('User has highlighted', text);
            }
        } else {
            console.log('Cursor not in the editor');
        }
    }

    private textChanged = (delta: QuillJS.DeltaStatic, oldContents: QuillJS.DeltaStatic, source: String) => {
        console.log("source:" + JSON.stringify(source));
        if (source != "silent") {
            this.file().content(document.querySelector(".ql-editor").innerHTML);
            this.file().modified(true);
        }
    }

    private onPasteHtml = (event, data) => {
        //var range = this.editor.getSelection();
        if (this.range != null) {
            console.log("Current Range: " + JSON.stringify(this.range))
            if(this.range.length == 0)
            {
                this.editor.insertText(this.range.index, data, 'api');
            }
            else {
                this.editor.updateContents({ ops: [{ retain: this.range.index },{ delete: this.range.length }, { insert: data }] });
            }
        }
    }

    private onAttachmentCreated = (event, data: any) => {
        try {
            var newAttachment = attachmentFile.fromJS(data);

            console.log("Attachment created, currentLocation = " + JSON.stringify(this.currentLocation()));
            var existing = ko.utils.arrayFirst(this.file().media(), attach => attach.fileName == data.fileName);
            if (existing != null) {
                this.file().media.remove(existing);
            }
            this.file().media().push(newAttachment);
            this.editor.insertEmbed(this.range.index, "image", data.contentBinary);
        }
        catch (error) {
            console.log(error);
        }
    }

    public tabChangedEvent = (data: App.Ui.Components.TabStrip.Model) => {
        this.file().content(this.editor.getText());
    }

    public getHtml = () => {
        window.console.debug();
    }

    public saveFile = () => {
        console.log("Saving File");
        ipcRenderer.send('app.File.Save', this.file());
    }

    public dispose() {
        if (this.subscriptions != null) {
            for (let i = 0; i < this.subscriptions.length; i++) {
                this.subscriptions[i].dispose();
            }
        }
    }
}
