import { AddressDetails } from "./address-details.model";
import { OrganisationDetails } from "./organisation-details.model";

export class Supplier {

    constructor(
        private _id: string,
        private _name: string,
        private _surname: string,
        private _wni: string,
        private _address: AddressDetails,
        private _organisation: OrganisationDetails
    ) {}

    public get organisation(): OrganisationDetails {
        return this._organisation;
    }
    public set organisation(value: OrganisationDetails) {
        this._organisation = value;
    }
    public get address(): AddressDetails {
        return this._address;
    }
    public set address(value: AddressDetails) {
        this._address = value;
    }
    public get wni(): string {
        return this._wni;
    }
    public set wni(value: string) {
        this._wni = value;
    }
    public get surname(): string {
        return this._surname;
    }
    public set surname(value: string) {
        this._surname = value;
    }
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    

}