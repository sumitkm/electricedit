/// <amd-dependency path="text!./quill-editor.html"/>

import * as ko from "knockout";
import * as Quill from "Quill";
import eeJson = require("../../model/eeJson");
import attachmentFile = require("../../model/attachmentFile");
export var template = require("text!./quill-editor.html");

let BlockEmbed: QuillJS.BlockEmbedStatic = Quill.import('blots/block/embed');
let Inline: QuillJS.InlineStatic = Quill.import('blots/inline');

class VimeoVideoBlot extends BlockEmbed {
    static create(url) {
        let node = super.create(url);

        // Set non-format related attributes with static values
        node.setAttribute('class', 'ql-video-border');
        node.setAttribute('allowfullscreen', true);

        return node;
    }

    static formats(node) {
        // We still need to report unregistered embed formats
        let format = { width: '', height: '' };
        if (node.hasAttribute('height')) {
            format.height = node.getAttribute('height');
        }
        if (node.hasAttribute('width')) {
            format.width = node.getAttribute('width');
        } else {
            format.height = '100%';
        }
        return format;
    }

    static value(node) {
        return node.getAttribute('src');
    }

    format(name, value) {
        // Handle unregistered embed formats
        if (name === 'height' || name === 'width') {
            if (value) {
                this.domNode.setAttribute(name, value);
            } else {
                this.domNode.removeAttribute(name, value);
            }
        } else {
            super.format(name, value);
        }
    }
}


class AddLinkBlot extends Inline {
  constructor(){
    super();
    console.log("Add link blot: Constructor");
  }
    static create(value) {
        let node = super.create(value);
        // Sanitize url value if desired
        node.setAttribute('href', value);
        // Okay to set other non-format related attributes
        // These are invisible to Parchment so must be static
        //node.setAttribute('target', '_blanky');
        return node;
    }

    static formats(node) {
        // We will only be called with a node already
        // determined to be a Link blot, so we do
        // not need to check ourselves
        return node.getAttribute('href');
    }
    static value(node) {
        return node.getAttribute('src');
    }

    format(name, value) {
        // Handle unregistered embed formats
        if (name === 'height' || name === 'width') {
            if (value) {
                this.domNode.setAttribute(name, value);
            } else {
                this.domNode.removeAttribute(name, value);
            }
        } else {
            super.format(name, value);
        }
    }
}

export class viewModel {
    private editor: QuillJS.QuillStatic;
    private currentLocation: KnockoutObservable<number> = ko.observable<number>(0);
    private file: KnockoutObservable<eeJson> = ko.observable<eeJson>(new eeJson());
    private selectedLinkText: KnockoutObservable<string> = ko.observable<string>("");
    private selectedLinkHref: KnockoutObservable<string> = ko.observable<string>("");
    private selectedLinkTitle: KnockoutObservable<string> = ko.observable<string>("");
    private selectedLinkTarget: KnockoutObservable<string> = ko.observable<string>("");
    private linkEditorDialog: any;
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
        ['vimeo-video'],
        ['save'],

        ['clean']                                         // remove formatting button
    ];
    constructor(params: any) {
        this.initTabs();

        if (params.file != null) {
            console.log('File loaded');
            this.file = params.file;
        }
        VimeoVideoBlot.blotName = 'vimeo-video';
        VimeoVideoBlot.tagName = 'video';
        // AddLinkBlot.blotName = 'link';
        // AddLinkBlot.tagName = 'a';

        //uill.register(VimeoVideoBlot);
        // Quill.register(AddLinkBlot);

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
        this.linkEditorDialog = <any>$("#link-editor-modal");

        var toolbar = this.editor.getModule('toolbar');
        toolbar.addHandler('link', this.showLinkEditor);

        document.querySelector('.ql-save').className += ' glyphicon glyphicon-floppy-disk';
        toolbar.addHandler('save', this.saveFile);

        document.querySelector('.ql-vimeo-video').className += ' glyphicon glyphicon-vimeo';
        toolbar.addHandler('save', this.showVimeoVideo);

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
        // let scrollTop = this.editor.root.scrollTop;
        // let range = this.editor.getSelection();
        // if (range) {
        //     //this.editor.formatText(range, 'link',  this.selectedLinkHref(), "user");
        //     this.editor.format('link', this.selectedLinkHref());
        //     //this.editor.format('link', this.selectedLinkHref());
        //
        //     //delete this.linkRange;
        // } else {
        //     //this.restoreFocus();
        //     let options = {
        //       href: this.selectedLinkHref(),
        //       text: this.selectedLinkText(),
        //       title: this.selectedLinkTitle(),
        //       target: this.selectedLinkTarget()
        //   };
        //     this.editor.format('link', this.selectedLinkHref());
        // }
        // this.editor.root.scrollTop = scrollTop;
        this.linkEditorDialog.modal('hide');
        this.editor.format('link', this.selectedLinkHref());
    }

    private showVimeoVideo = () => {
        //this.editor.showToolBar()
    }

    private initTabs() {
        //this.tabs.push(new App.Ui.Components.TabStrip.Model( "HTML Preview", false ));
    }

    private selectionChanged = (delta, oldDelta, source) => {
        //console.log(this.editor.getFormat());
    }

    private textChanged = (delta, oldDelta, source) => {
        console.log("source:" + JSON.stringify(source));
        if (source != "silent") {
            this.file().content(document.querySelector(".ql-editor").innerHTML);
            this.file().modified(true);
        }
    }

    private onPasteHtml = (event, data) => {
        var range = this.editor.getSelection();
        if (range != null) {
            this.editor.updateContents({ ops: [{ retain: range.length }, { insert: data }] });
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
            this.editor.insertEmbed(this.currentLocation(), "image", data.contentBinary);
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
