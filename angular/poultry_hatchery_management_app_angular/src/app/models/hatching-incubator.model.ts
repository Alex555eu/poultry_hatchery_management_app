import { OrganisationDetails } from "./organisation-details.model";

export class HatchingIncubator {
    

    public constructor(
        private _id: string,
        private _maxCapacity: string,
        private _humanReadableId: string,
        private _organisation: OrganisationDetails
    ){}

    public get id(): string{
        return this._id;
    }
    public set id(val: string){
        this._id = val;
    }

    public get maxCapacity(): string{
        return this._maxCapacity;
    }
    public set maxCapacity(val: string){
        this._maxCapacity = val;
    }

    public get humanReadableId(): string{
        return this._humanReadableId;
    }
    public set humanReadableId(val: string){
        this._humanReadableId = val;
    }

    public get organisation(): OrganisationDetails{
        return this._organisation;
    }
    public set organisation(val: OrganisationDetails){
        this._organisation = val;
    }

}
