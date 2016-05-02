class menus {
    menuTemplate : Array<any> = []
    constructor() {
        this.menuTemplate = [
            {
                label: 'File',
                accelerator: 'Alt+F',
                submenu: [
                    {
                        label: 'New',
                        accelerator: 'CmdOrCtrl+N',
                        click: () => this.sendMessage("menu.File.OnNew")
                    },
                    {
                        label: 'Open',
                        accelerator: 'CmdOrCtrl+O',
                        click: () => this.sendMessage("menu.File.Open")
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Save',
                        accelerator: 'CmdOrCtrl+S',
                        click: () => this.sendMessage("menu.File.OnSave")
                    },
                    {
                        label: 'Save As...',
                        accelerator: 'CmdOrCtrl+Shift+S',
                        click: () => this.sendMessage("menu.File.OnSaveAs")
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Print',
                        accelerator: 'CmdOrCtrl+P',
                        click: () => this.sendMessage("menu.File.OnPrint")
                    },
                    ,
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Exit',
                        accelerator: (function() {
                            if (process.platform == 'darwin')
                                return 'Command+Q';
                            else
                                return 'Alt+F4';
                        })(),
                        click: () => this.sendMessage("menu.App.Quit")
                    }
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    {
                        label: 'Undo',
                        accelerator: 'CmdOrCtrl+Z',
                        role: 'undo'
                    },
                    {
                        label: 'Redo',
                        accelerator: 'Shift+CmdOrCtrl+Z',
                        role: 'redo'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Cut',
                        accelerator: 'CmdOrCtrl+X',
                        role: 'cut'
                    },
                    {
                        label: 'Copy',
                        accelerator: 'CmdOrCtrl+C',
                        role: 'copy'
                    },
                    {
                        label: 'Paste',
                        accelerator: 'CmdOrCtrl+V',
                        //role: 'paste',
                        click: () =>  this.sendMessage("paste")
                    },
                    {
                        label: 'Select All',
                        accelerator: 'CmdOrCtrl+A',
                        role: 'selectall'
                    },
                ]
            },
            {
                label: 'View',
                submenu: [
                    {
                        label: 'Settings',
                        click: () => this.sendMessage("menu.View.OnSettings")
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Connect to WordPress...',
                        click: () => this.sendMessage("menu.View.ConnectWordPress")
                    },
                    {
                        label: 'Post to Blog...',
                        click: () => this.sendMessage("menu.View.GetMySites")
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Reload',
                        accelerator: 'CmdOrCtrl+R',
                        click: function(item, focusedWindow) {
                            if (focusedWindow)
                                focusedWindow.reload();
                        }
                    },
                    {
                        label: 'Toggle Full Screen',
                        accelerator: (function() {
                            if (process.platform == 'darwin')
                                return 'Ctrl+Command+F';
                            else
                                return 'F11';
                        })(),
                        click: function(item, focusedWindow) {
                            if (focusedWindow)
                                focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                        }
                    },
                    {
                        label: 'Toggle Developer Tools',
                        accelerator: (function() {
                            if (process.platform == 'darwin')
                                return 'Alt+Command+I';
                            else
                                return 'Ctrl+Shift+I';
                        })(),
                        click: function(item, focusedWindow) {
                            if (focusedWindow)
                                focusedWindow.toggleDevTools();
                        }
                    },
                ]
            },
            {
                label: 'Window',
                role: 'window',
                submenu: [
                    {
                        label: 'Minimize',
                        accelerator: 'CmdOrCtrl+M',
                        role: 'minimize'
                    },
                    {
                        label: 'Close',
                        accelerator: 'CmdOrCtrl+W',
                        role: 'close'
                    },
                ]
            },
            {
                label: 'Help',
                role: 'help',
                submenu: [
                    {
                        label: 'Learn More',
                        click: function() { require('electron').shell.openExternal('http://electron.atom.io') }
                    },
                ]
            },
        ];
        if (process.platform == 'darwin') {
            var name = "Electric Edit";
            this.menuTemplate.unshift({
                label: name,
                submenu: [
                    {
                        label: 'About ' + name,
                        role: 'about'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Services',
                        role: 'services',
                        submenu: []
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Hide ' + name,
                        accelerator: 'Command+H',
                        role: 'hide'
                    },
                    {
                        label: 'Hide Others',
                        accelerator: 'Command+Alt+H',
                        role: 'hideothers'
                    },
                    {
                        label: 'Show All',
                        role: 'unhide'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: 'Quit',
                        accelerator: 'Command+Q',
                        click: () => this.sendMessage("menu.App.Quit")
                    },
                ]
            });
            // Window menu.
            this.menuTemplate[3].submenu.push(
                {
                    type: 'separator'
                },
                {
                    label: 'Bring All to Front',
                    role: 'front'
                });
        }
    }

    public sendMessage(id: string) {
        if (ipcRenderer != null) {
            ipcRenderer.send(id);
        }
        return true;
    }
}

export { menus as Menus }
