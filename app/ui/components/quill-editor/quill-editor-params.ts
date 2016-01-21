import * as ko from "knockout";
export class QuillEditorParams
{
  content: KnockoutObservable<string>;
  showToolBar: KnockoutObservable<boolean>;
  constructor()
  {
    var ko = require("knockout");
    this.content = ko.observable("");
    this.showToolBar = ko.observable(true);
  }
}
