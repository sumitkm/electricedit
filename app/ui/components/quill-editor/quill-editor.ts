/// <amd-dependency path="text!./quill-editor.html"/>
/// <amd-dependency path="quill" />
/// <amd-dependency path="knockout" />

var ko = <KnockoutStatic>require("knockout");
export var Quill = require("quill");
export var template = require("text!./quill-editor.html");

export class viewModel {
    private editor: QuillStatic;
    private file: KnockoutObservable<any> = ko.observable({ fileName: '', content: '' });
    subscriptions = [];

    constructor(params: any) {
        this.initTabs();
        if (params.file != null) {
            console.log('File loaded');
            this.file = params.file;
        }
        this.subscriptions.push(this.file.subscribe((newValue) => {
            console.log('file changed');
            this.editor.setHTML(this.file().content);
        }));

        this.editor = new Quill('#editor', {
            modules:
            {
                "toolbar": { container: "#toolbar" }
            },
            theme: 'snow'
        });

        this.editor.on('text-change', (delta, source) => {
            this.file().content = this.editor.getHTML();
        });

        ipcRenderer.on('menu.File.Save', (event, data) => {
            this.saveFile();
        });
        this.editor.setHTML(this.file().content);
    }

    private initTabs() {
        //this.tabs.push(new App.Ui.Components.TabStrip.Model( "HTML Preview", false ));
    }

    public saveFile = () => {
        this.file().content = this.editor.getHTML();
        ipcRenderer.send('app.File.Save', this.file());
    }

    public tabChangedEvent = (data: App.Ui.Components.TabStrip.Model) => {
        //data.active(!data.active());
        this.file().content = this.editor.getHTML();
    }

    public getHtml = () => {
        window.console.debug();
    }

    public dispose() {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].dispose();
        }
        //amplify.unsubscribe(App.Ui.Components.TabStrip.Model.TabChangedEvent, this.tabChangedEvent);
    }
}
