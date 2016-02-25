/// <reference path="../../model/currentFile.ts" />

/// <amd-dependency path="text!./quill-editor.html"/>
/// <amd-dependency path="quill" />
/// <amd-dependency path="knockout" />

var ko = <KnockoutStatic>require("knockout");
export var Quill = require("quill");
export var template = require("text!./quill-editor.html");
import CurrentFile = require("../../model/currentFile");

export class viewModel {
    private editor: QuillStatic;
    private file: KnockoutObservable<CurrentFile>;// = ko.observable<CurrentFile>({ fileName: '', content: '', modified: false });
    subscriptions = [];

    constructor(params: any) {
        this.initTabs();

        if (params.file != null) {
            console.log('File loaded');
            this.file = params.file;
        }

        this.subscriptions.push(this.file.subscribe((newValue) => {
            console.log('file changed');
            this.editor.setHTML(this.file().content());
        }));

        this.editor = new Quill('#editor', {
            modules:
            {
                "toolbar": { container: "#toolbar" }
            },
            theme: 'snow'
        });

        this.editor.on('text-change', (delta, source) => {
            this.file().content (this.editor.getHTML());
            this.file().modified (true);

        });


        ipcRenderer.on("paste.html", (event, data)=>
        {
            var range = this.editor.getSelection();
            this.editor.updateContents({ ops: [ { retain: range.end }, { insert: data }]});
        });

        ipcRenderer.on('app.File.Attachment.Created', (event, data) => {
            console.log(JSON.stringify(data));
            var sel = this.editor.getSelection();

            this.editor.insertEmbed(0, "image", data.fileName);
        });
        this.editor.setHTML(this.file().content());
    }

    private initTabs() {
        //this.tabs.push(new App.Ui.Components.TabStrip.Model( "HTML Preview", false ));
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
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].dispose();
        }
    }
}
