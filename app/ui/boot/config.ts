/// <reference path="../typings/index.d.ts"/>

import * as ko from "knockout";
export class Spa {

  constructor() {
    this.registerComponents();
    ko.applyBindings();
  }

  public registerComponents() {
    this.registerComponent("home-page", "pages/home-page/home-page")
    this.registerComponent("print-preview", "components/print-preview/print-preview");
    this.registerComponent("quill-editor", "components/quill-editor/quill-editor");
    this.registerComponent("settings-editor", "components/settings-editor/settings-editor");
    this.registerComponent("post-blog", "components/post-blog/post-blog");
    this.registerComponent("tab-strip", "components/tab-strip/tab-strip");
    this.registerComponent("save-attachments", "components/save-attachments/save-attachments");
    this.registerComponent("tree-node", "components/tree-node/tree-node");
    this.registerComponent("tree-view", "components/tree-view/tree-view");
  }

  public registerComponent(name: string, location: string) {
    ko.components.register(name, { require: location });
  }
}
