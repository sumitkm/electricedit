interface CurrentFile
{
    fileName: KnockoutObservable<string>;
    content?: KnockoutObservable<string>;
    title?: KnockoutObservable<string>;
    postId?: KnockoutObservable<string>;
    siteId?: KnockoutObservable<string>;
    urlSlug?: KnockoutObservable<string>;
    modified: KnockoutObservable<boolean>;
}
export = CurrentFile;
