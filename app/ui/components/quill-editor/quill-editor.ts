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
  public markup: KnockoutObservable<string>;

  constructor(params: any) {
    this.initTabs();
    if (params.content != null) {
      this.markup = params.content;
    }
    else {
      this.markup = ko.observable("");
    }
    //amplify.subscribe(App.Ui.Components.TabStrip.Model.TabChangedEvent, this, this.tabChangedEvent);


    this.editor = new Quill('#editor', {
      modules:
      {
        "toolbar": { container: "#toolbar" }
      },
      theme: 'snow'
    });

    this.editor.on('text-change', (delta, source) => {
      this.markup(this.editor.getHTML());
    });

    ipcRenderer.on('menu.file.opened', (event, data) => {
        alert('Got data');
        this.editor.setHTML(data);
    });
  }

  private initTabs() {
    //this.tabs.push(new App.Ui.Components.TabStrip.Model( "HTML Preview", false ));
  }

  public saveFile = () => {
    ipcRenderer.send('menu.File.Save', this.markup());
  }

  public tabChangedEvent = (data: App.Ui.Components.TabStrip.Model) => {
    //data.active(!data.active());
    this.markup(this.editor.getHTML());
  }

  public getHtml = () => {
    window.console.debug();
  }

  public dispose() {
    //amplify.unsubscribe(App.Ui.Components.TabStrip.Model.TabChangedEvent, this.tabChangedEvent);
  }
}
