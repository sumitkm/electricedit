module App.Ui.Components.TabStrip
{
  export class Model
  {
    public name: KnockoutObservable<string>;
    public active: KnockoutObservable<boolean>;
    public static TabChangedEvent: string = "App.Ui.Components.TabStrip.TabChangedEvent";

    constructor(name: string="", active: boolean=false)
    {
      var ko = require("knockout");
      this.name = ko.observable(name);
      this.active = ko.observable(active);
    }
  }
}
