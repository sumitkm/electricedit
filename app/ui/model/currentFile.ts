interface currentFile
{
    fileName: KnockoutObservable<string>;
    content?: KnockoutObservable<string>;
    title?: KnockoutObservable<string>;
    postId?: KnockoutObservable<string>;
    siteId?: KnockoutObservable<string>;
    urlSlug?: KnockoutObservable<string>;
    modified: KnockoutObservable<boolean>;
    type?: KnockoutObservable<string>;
}
export = currentFile;
