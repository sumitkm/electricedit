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
    subscriptions = [];
    private toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean']                                         // remove formatting button
    ];
    constructor(params: any) {
        this.initTabs();

        if (params.file != null) {
            console.log('File loaded');
            this.file = params.file;
        }

        this.subscriptions.push(this.file.subscribe((newValue) => {
            this.editor.setContents(this.file().content());
        }));

        this.editor = new Quill('#editor', {
          modules: {
            toolbar: this.toolbarOptions
          },
          theme: 'snow'
        });

        this.editor.on('text-change', this.textChanged);
        ipcRenderer.on("paste.html", this.onPasteHtml);
        ipcRenderer.on('app.File.Attachment.Created', this.onAttachmentCreated);

        this.editor.pasteHTML(this.file().content());
    }

    private initTabs() {
        //this.tabs.push(new App.Ui.Components.TabStrip.Model( "HTML Preview", false ));
    }

    private textChanged = (delta, source) =>
    {
        this.file().content ((<any>this.editor).innerHTML);
        this.file().modified (true);
        var range = this.editor.getSelection();
        var position = this.editor.getLength();
        if(range !=null)
        {
            position = range.length;
        }
        this.currentLocation(position);
    }

    private onPasteHtml = (event, data) =>
    {
        var range = this.editor.getSelection();
        this.editor.updateContents({ ops: [ { retain: range.length }, { insert: data }]});
    }

    private onAttachmentCreated = (event, data: any) =>
    {
        try
        {
            var newAttachment = attachmentFile.fromJS(data);

            console.log("Attachment created, currentLocation = " + JSON.stringify(this.currentLocation()));
            var existing = ko.utils.arrayFirst(this.file().media(), attach => attach.fileName == data.fileName);
            if(existing != null)
            {
                this.file().media.remove(existing);
            }
            this.file().media().push(newAttachment);
            this.editor.insertEmbed(this.currentLocation(), "image", data.contentBinary);
        }
        catch (error)
        {
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
