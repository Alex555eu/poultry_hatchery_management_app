import { OrganisationDetails } from "./organisation-details.model";

export class ProductType {

    public constructor(
        private _id: string,
        private _name: string,
        private _organisation: OrganisationDetails
    ){}


    public get id(): string{
        return this._id;
    }
    public set id(val: string){
        this._id = val;
    }

    public get name(): string{
        return this._name;
    }
    public set name(val: string){
        this._name = val;
    }

    public get organisation(): OrganisationDetails{
        return this._organisation;
    }
    public set organisation(val: OrganisationDetails){
        this._organisation = val;
    }

}