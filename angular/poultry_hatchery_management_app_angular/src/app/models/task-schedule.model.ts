import { OrganisationDetails } from "./organisation-details.model";

export class TaskSchedule {

    constructor(
        private _id: string,
        private _title: string,
        private _organisation: OrganisationDetails,
    ){}
    
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
    }
    public get organisation(): OrganisationDetails {
        return this._organisation;
    }
    public set organisation(value: OrganisationDetails) {
        this._organisation = value;
    }

}