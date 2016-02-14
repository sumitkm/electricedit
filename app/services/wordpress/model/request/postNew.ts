export module wordpress.model.request
{
    export class postNew
    {
        ID: number;
        name: string;
        description: string;
        url: string;
        visible: boolean;
        is_private: boolean;
    }
}
