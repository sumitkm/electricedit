/// <amd-dependency path="text!./quill-editor.html"/>
/// <amd-dependency path="quill" />
/// <amd-dependency path="knockout" />

//import * as ko from "knockout";
var ko = <KnockoutStatic>require("knockout");
export var Quill = require("quill");
export var template = require("text!./quill-editor.html");

export class viewModel {
    private editor: QuillStatic;
    //public tabs: Array<App.Ui.Components.TabStrip.Model> = [];
    private file: KnockoutObservable<any> = ko.observable({ fileName: '', content: '' });

    constructor(params: any) {
        this.initTabs();

        //amplify.subscribe(App.Ui.Components.TabStrip.Model.TabChangedEvent, this, this.tabChangedEvent);

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

        ipcRenderer.on('menu.file.opened', (event, data) => {
            this.file(data);
            this.editor.setHTML(this.file().content);
        });

        ipcRenderer.on('menu.File.Save', (event, data) => {
            this.saveFile();
        });
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
        //amplify.unsubscribe(App.Ui.Components.TabStrip.Model.TabChangedEvent, this.tabChangedEvent);
    }
}
