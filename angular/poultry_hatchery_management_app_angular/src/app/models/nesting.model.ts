import { OrganisationDetails } from "./organisation-details.model";

export class Nesting {
    
    constructor(
        private _id: string,
        private _dateTime: Date,
        private _title: string,
        private _description: string,
        private _isFinished: boolean,
        private _organisation: OrganisationDetails,
    ){}

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get dateTime(): Date {
        return this._dateTime;
    }
    public set dateTime(value: Date) {
        this._dateTime = value;
    }
    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
    }
    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }
    public get isFinished(): boolean {
        return this._isFinished;
    }
    public set isFinished(value: boolean) {
        this._isFinished = value;
    }
    public get organisation(): OrganisationDetails {
        return this._organisation;
    }
    public set organisation(value: OrganisationDetails) {
        this._organisation = value;
    }

}