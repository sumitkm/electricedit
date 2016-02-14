export module wordpress.model.response
{
    export class mySite
    {
        ID: number;
        name: string;
        description: string;
        url: string;
        visible: boolean;
        is_private: boolean;
    }
}
