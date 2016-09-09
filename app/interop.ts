/// <reference path="./typings/index.d.ts"/>

const electron  = require('electron');
const app : Electron.App = electron.app;
const ipcMain : Electron.IpcMain = require('electron').ipcMain;
const ipcRenderer : Electron.IpcRenderer = require('electron').ipcRenderer;
const dialog : Electron.Dialog = require('electron').dialog;
const remote : Electron.Remote = require('electron').remote;
