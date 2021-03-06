/// <reference path="../../typings/index.d.ts"/>
// TypeScript version of electron-oauth2 from https://github.com/mawie81/electron-oauth2/blob/master/index.js


import * as fetch from 'node-fetch';
import * as electron from 'electron';
import * as queryString from 'querystring';
var Promise = require('pinkie-promise');
var objectAssign = require('object-assign');

const BrowserWindow = electron.BrowserWindow;


class oAuth2 {

    currentConfig: any;
    currentWindowParams: any;

    constructor(config: any, windowParams: any) {
        this.currentConfig = config;
        this.currentWindowParams = windowParams;
    }

    public getAuthorizationCode = (opts: any) => {
        opts = opts || {};
        var urlParams = {
            response_type: 'code',
            redirect_uri: this.currentConfig.redirectUrl,
            client_id: this.currentConfig.clientId,
            scope: 'global'
        };

        var url = this.currentConfig.authorizationUrl + '?' + queryString.stringify(urlParams);

        return new Promise((resolve: any, reject: any) => {
            const authWindow = new BrowserWindow(this.currentWindowParams || { 'use-content-size': true });

            authWindow.loadURL(url);
            authWindow.show();

            authWindow.on('closed', () => {
                reject(new Error('window was closed by user'));
            });

            authWindow.webContents.on('did-get-redirect-request', (event: any, oldUrl: string, newUrl: string) => {
                if (newUrl.indexOf(urlParams.redirect_uri) == 0) {
                    var rawCode = /\?code=(.+)\&\b/.exec(newUrl) || /authorize\/([^&]*)/.exec(newUrl);
                    var code = (rawCode && rawCode.length > 1) ? rawCode[1] : null;
                    var error = /\?error=(.+)$/.exec(newUrl);

                    if (error) {
                        reject(error);
                        console.log("oAuth2 : FAILURE:" + JSON.stringify(error, null, 4));

                        authWindow.removeAllListeners('closed');
                        authWindow.destroy();
                    } else if (code) {
                        resolve(code);
                        console.log("oAuth2 : SUCCESS:" + JSON.stringify(code, null, 4));
                        authWindow.removeAllListeners('closed');
                        authWindow.destroy();
                    }
                }
            });
        });
    }

    public tokenRequest = (data: any) => {
        const header = <any>{
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        if (this.currentConfig.useBasicAuthorizationHeader) {
            header.Authorization = 'Basic ' + new Buffer(this.currentConfig.clientId + ':' + this.currentConfig.clientSecret).toString('base64');
        } else {
            objectAssign(data, {
                client_id: this.currentConfig.clientId,
                client_secret: this.currentConfig.clientSecret
            });
        }

        return fetch(this.currentConfig.tokenUrl, {
            method: 'POST',
            headers: header,
            body: queryString.stringify(data)
        }).then((res: any) => {
            return res.json();
        });
    }

    public getAccessToken = (opts: any) =>
    {
        return this.getAuthorizationCode(opts)
            .then((authorizationCode: any) =>
            {
                return this.tokenRequest(
                    {
                        code: authorizationCode,
                        grant_type: 'authorization_code',
                        redirect_uri: this.currentConfig.redirectUrl
                    });
            });
    }

    //
    // WordPress doesn't support grant_type: 'refresh_token'
    //
    // public refreshToken = (refreshToken) => {
    //     return this.tokenRequest({
    //         refresh_token: refreshToken,
    //         grant_type: 'refresh_token',
    //         redirect_uri: this.currentConfig.redirectUrl
    //     });
    // }
}

export {oAuth2};
