/// <amd-dependency path="text!./tab-strip.html" />
/// <amd-dependency path="app/ui/components/tab-strip/tab-strip-model" />

import * as ko from "knockout";

export var template = require("text!./tab-strip.html");

export class viewModel
{
  public tabs: KnockoutObservableArray<App.Ui.Components.TabStrip.Model> = ko.observableArray([]);

  constructor(params: any)
  {
    ko.utils.arrayPushAll<App.Ui.Components.TabStrip.Model>(this.tabs, params.tabs);
  }

  public tabClicked = (data: viewModel, context: App.Ui.Components.TabStrip.Model)=>
  {
    for (let i = 0; i < data.tabs().length; i++)
    {
      data.tabs()[i].active(data.tabs()[i].name == context.name);
    }
    //amplify.publish(App.Ui.Components.TabStrip.Model.TabChangedEvent, context);
  }
}
