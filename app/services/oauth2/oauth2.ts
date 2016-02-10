// TypeScript version of electron-oauth2 from https://github.com/mawie81/electron-oauth2/blob/master/index.js
const Promise = require('pinkie-promise');
const fetch = require('node-fetch');
const objectAssign = require('object-assign');
const electron = require('electron');
const queryString = require('querystring');
const BrowserWindow = electron.BrowserWindow;

class oAuth2 {

    currentConfig: any;
    currentWindowParams: any;

    constructor(config, windowParams) {
        this.currentConfig = config;
        this.currentWindowParams = windowParams;
    }

    public getAuthorizationCode = (opts) => {
        opts = opts || {};
        var urlParams = {
            response_type: 'code',
            redirect_uri: this.currentConfig.redirectUrl,
            client_id: this.currentConfig.clientId,
            scope: 'global'
        };

        // if (opts.scope) {
        //     urlParams.scope = opts.scope;
        // }
        //
        // if (opts.accessType) {
        //     urlParams.access_type = opts.accessType;
        // }

        var url = this.currentConfig.authorizationUrl + '?' + queryString.stringify(urlParams);
        console.log("First Request:" + url);

        return new Promise((resolve, reject) => {
            const authWindow = new BrowserWindow(this.currentWindowParams || { 'use-content-size': true });

            authWindow.loadURL(url);
            authWindow.show();

            authWindow.on('closed', () => {
                reject(new Error('window was closed by user'));
            });

            authWindow.webContents.on('did-get-redirect-request', (event, oldUrl: string, newUrl: string) => {
                if (newUrl.indexOf(urlParams.redirect_uri) == 0) {
                    var rawCode = /\?code=(.+)\&\b/.exec(newUrl) || /authorize\/([^&]*)/.exec(newUrl);
                    var code = (rawCode && rawCode.length > 1) ? rawCode[1] : null;
                    var error = /\?error=(.+)$/.exec(newUrl);

                    if (error) {
                        reject(error);
                        console.log("FAILURE:" + JSON.stringify(error));

                        authWindow.removeAllListeners('closed');
                        authWindow.destroy();
                    } else if (code) {
                        resolve(code);
                        console.log("SUCCESS:" + JSON.stringify(code));
                        //TODO: Save the code to config for the correct oAuth2Group
                        authWindow.removeAllListeners('closed');
                        authWindow.destroy();
                    }
                }
            });
        });
    }

    public tokenRequest = (data) => {
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
        }).then(res => {
            return res.json();
        });
    }

    public getAccessToken = (opts) => {
        return this.getAuthorizationCode(opts)
            .then(authorizationCode => {
            return this.tokenRequest({
                code: authorizationCode,
                grant_type: 'authorization_code',
                redirect_uri: this.currentConfig.redirectUrl
            });
        });
    }

    public refreshToken = (refreshToken) => {
        return this.tokenRequest({
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
            redirect_uri: this.currentConfig.redirectUrl
        });
    }
}

export = oAuth2;
