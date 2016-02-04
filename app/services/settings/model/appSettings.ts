
export class appSettings {
    public autoReopen: boolean = false;
    public lastOpenFile: string = "";
    public oAuth2Groups: Array<oAuth2Group> = [];
}

export class oAuth2Group {
    public groupName: string = "";
    public oAuthClientId: string = "";
    public oAuthClientSecret: string = "";
    public redirectUrl: string = "";
    public baseUrl: string = "";
    public tokenUrl: string = "";
    public authorizeUrl: string = "";
    public authenticateUrl: string = "";
}
