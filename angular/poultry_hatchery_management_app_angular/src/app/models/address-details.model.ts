export class AddressDetails {

    public constructor(
        private _id: string, 
        private _city :string,
        private _postalCode: string,
        private _street: string,
        private _number: string
    ) {}

    public get id(): string{
        return this._id;
    }
    public set id(val: string){
        this._id = val;
    }

    public get city(): string{
        return this._city;
    }
    public set city(val: string){
        this._city = val;
    }

    public get postalCode(): string{
        return this._postalCode;
    }
    public set postalCode(val: string){
        this._postalCode = val;
    }

    public get street(): string{
        return this._street;
    }
    public set street(val: string){
        this._street = val;
    }

    public get number(): string{
        return this._number;
    }
    public set number(val: string){
        this._number = val;
    }

}
