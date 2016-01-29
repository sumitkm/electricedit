///<reference path="../../interop.d.ts"/>
/// <reference path="../../../typings/tsd.d.ts"/>

export class Files {
    mainWindow: any;
    constructor(window: any) {
      this.mainWindow = window;
    }
    public Save(content: string) {
      var dialog = require('electron').dialog;
      dialog.showSaveDialog(this.mainWindow,
        {
          title: "Save File",
          defaultPath: "/user/sumitkm/Documents",
          filters: [
          { name: 'All Files', extensions: ['*'] },
          { name: 'HTML', extensions: ['html','htm'] }
        ]
        }, (filename) => {
          var fs = require('fs');
          fs.writeFile(filename, content, function(err) {
              if(err) {
                  return console.log(err);
              }

              console.log("The file was saved!");
          });

        });

    }
  }
