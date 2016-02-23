/// <reference path="../typings/tsd.d.ts"/>

import * as ko from "knockout";
export class Spa {

  constructor() {
    this.registerComponents();
    ko.applyBindings();
  }

  public registerComponents() {
    this.registerComponent("home-page", "ui/pages/home-page/home-page")
    this.registerComponent("quill-editor", "ui/components/quill-editor/quill-editor");
    this.registerComponent("settings-editor", "ui/components/settings-editor/settings-editor");
    this.registerComponent("post-blog", "ui/components/post-blog/post-blog");
    this.registerComponent("tab-strip", "ui/components/tab-strip/tab-strip");
    this.registerComponent("save-attachments", "ui/components/save-attachments/save-attachments");
  }

  public registerComponent(name: string, location: string) {
    ko.components.register(name, { require: location });
  }
}
