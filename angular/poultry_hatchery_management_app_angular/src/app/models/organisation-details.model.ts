import { AddressDetails } from "./address-details.model";

export class OrganisationDetails {

    public constructor(
       private _id: string,
       private _name: string,
       private _regon: string,
       private _address: AddressDetails 
    ) {}

    public get id(): string {
        return this._id;
    }
    public set id(val: string) {
        this._id = val;
    }

    public get name(): string {
        return this._name;
    }
    public set name(val: string) {
        this._name = val;
    }

    public get regon(): string {
        return this._regon;
    }
    public set regon(val: string) {
        this._regon = val;
    }

    public get address(): AddressDetails {
        return this._address;
    }
    public set address(val: AddressDetails) {
        this._address = val;
    }
}
