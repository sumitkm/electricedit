const electron = require('electron');
const servives = require("./services/events/files.js");
const ipcMain = require('electron').ipcMain;
const ipcRenderer = require('electron').ipcRenderer;
const dialog = require('electron').dialog;

console.log(ipcRenderer.sendSync('synchronous-message', 'Initializing Interop')); // prints "pong"

ipcRenderer.on('asynchronous-reply', function(event, arg) {
  console.log(arg); 
});

ipcRenderer.send('asynchronous-message', 'Initializing Interop');
