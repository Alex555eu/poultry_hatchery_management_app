import { Nesting } from "./nesting.model";
import { OrganisationDetails } from "./organisation-details.model";
import { Task } from "./task.model";

export class Candling {

    constructor(
        private _id: string,
        private _scheduledAt: Date,
        private _candlingNumber: number,
        private _nesting: Nesting,
        private _task: Task,
        private _organisationDetails: OrganisationDetails,
    ){}

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get scheduledAt(): Date {
        return this._scheduledAt;
    }
    public set scheduledAt(value: Date) {
        this._scheduledAt = value;
    }
    public get candlingNumber(): number {
        return this._candlingNumber;
    }
    public set candlingNumber(value: number) {
        this._candlingNumber = value;
    }
    public get nesting(): Nesting {
        return this._nesting;
    }
    public set nesting(value: Nesting) {
        this._nesting = value;
    }
    public get task(): Task {
        return this._task;
    }
    public set task(value: Task) {
        this._task = value;
    }
    public get organisationDetails(): OrganisationDetails {
        return this._organisationDetails;
    }
    public set organisationDetails(value: OrganisationDetails) {
        this._organisationDetails = value;
    }
    
}