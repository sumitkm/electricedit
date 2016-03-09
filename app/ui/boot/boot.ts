// For any third party dependencies, like jQuery, place them in the libs folder.
// Configure loading modules from the libs directory,
// except for 'app' ones, which are in a sibling
// directory.
//
/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="../interop.d.ts"/>

requirejs.config(
  {
    baseUrl: __dirname + '/ui/',
    paths:
    {
        "jquery": "libs/jquery/dist/jquery.min",
        "crossroads": "libs/crossroads/dist/crossroads",
        "js-signals": "libs/js-signals/dist/signals",
        "knockout": "libs/knockout/dist/knockout",
        "text" : "libs/text/text",
        "quill" : "libs/quill/dist/quill",
        "bootstrap":"libs/bootstrap/dist/js/bootstrap"
    },
    shim:
    {
      "bootstrap": { deps: ["jquery"] },
      "jquery": { exports : "$" }
    }
});


// Start loading the main app file. Put all of
// your application logic in there.
requirejs(["jquery", "knockout", "text", "bootstrap", "boot/config"], ($, ko, text, bootstrap, config)=>
{
  var spaApp = new config.Spa();
});
