/// <reference path="typings/tsd.d.ts"/>

const electron  : GitHubElectron.Electron = require('electron');
 const app : GitHubElectron.App = electron.app;
 const ipcMain : GitHubElectron.IPCMain = require('electron').ipcMain;
 const ipcRenderer : GitHubElectron.IpcRenderer = require('electron').ipcRenderer;
 const dialog : GitHubElectron.Dialog = require('electron').dialog;
 const remote : GitHubElectron.Remote = require('electron').remote;
