
import ko = require("knockout");
class editorSettings {
    public autoReopen: KnockoutObservable<boolean> = ko.observable(true);
    public lastOpenFile: KnockoutObservable<string> = ko.observable("");
    public oAuth2Groups: KnockoutObservableArray<oAuth2Group> = ko.observableArray([]);

    public toJS() {
        return {
            autoReopen: this.autoReopen(),
            lastOpenFile: this.lastOpenFile(),
            oAuth2Groups: this.mapAuth2GroupsJS(this.oAuth2Groups())
        };
    }

    public mapAuth2GroupsJS(groups: Array<oAuth2Group>): Array<any> {
        var outGroups = [];
        if (groups != null) {
            for (let i = 0; i < groups.length; i++) {
                outGroups.push(ko.toJS(groups[i]));
            }
        }
        return outGroups;
    }

    public static fromJS(settings: any): editorSettings {
        var newSettings = new editorSettings();
        newSettings.autoReopen(settings['autoReopen']);
        newSettings.lastOpenFile(settings['lastOpenFile'])
        newSettings.oAuth2Groups(settings['oAuth2Groups'])
        return newSettings;
    }
}

class oAuth2Group {
    public groupName: KnockoutObservable<string> = ko.observable("");
    public accessToken: KnockoutObservable<string> = ko.observable("");
    public oAuthClientId: KnockoutObservable<string> = ko.observable("");
    public oAuthClientSecret: KnockoutObservable<string> = ko.observable("");
    public redirectUrl: KnockoutObservable<string> = ko.observable("");
    public baseUrl: KnockoutObservable<string> = ko.observable("");
    public tokenUrl: KnockoutObservable<string> = ko.observable("oauth2/token");
    public authorizeUrl: KnockoutObservable<string> = ko.observable("oauth2/authorize");
    public authenticateUrl: KnockoutObservable<string> = ko.observable("oauth2/authenticate");

    public toJS() {
        return {
            groupName: this.groupName(),
            oAuthClientId: this.oAuthClientId(),
            oAuthClientSecret: this.oAuthClientSecret(),
            redirectUrl: this.redirectUrl(),
            baseUrl: this.baseUrl(),
            tokenUrl: this.tokenUrl(),
            authorizeUrl: this.authorizeUrl(),
            authenticateUrl: this.authenticateUrl()
        };
    }
}

export { editorSettings as editorSettings };
export { oAuth2Group as oAuth2Group };
