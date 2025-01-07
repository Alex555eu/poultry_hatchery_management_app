import { Nesting } from "./nesting.model";
import { OrganisationDetails } from "./organisation-details.model";
import { Task } from "./task.model";

export class Candling {

    constructor(
        private _id: string,
        private _createdAt: Date,
        private _candlingNumber: number,
        private _initialEggsQuantity: number,
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
    public get createdAt(): Date {
        return this._createdAt;
    }
    public set createdAt(value: Date) {
        this._createdAt = value;
    }
    public get candlingNumber(): number {
        return this._candlingNumber;
    }
    public set candlingNumber(value: number) {
        this._candlingNumber = value;
    }
    public get initialEggsQuantity(): number {
        return this._initialEggsQuantity;
    }
    public set initialEggsQuantity(value: number) {
        this._initialEggsQuantity = value;
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