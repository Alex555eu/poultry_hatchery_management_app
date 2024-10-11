import { OrganisationDetails } from "./organisation-details.model";

export class UserDetails {

    private _id: string;
    private _firstName: string;
    private _lastName: string;
    private _emailAddress: string;
    private _role: string;
    private _organisation: OrganisationDetails;
    
    public constructor(
        id: string, 
        firstName:string,
        lastName: string,
        emailAddress: string,
        role: string,
        organisation: OrganisationDetails
    ) {
        this._id = id;
        this._firstName = firstName;
        this._lastName = lastName;
        this._emailAddress = emailAddress;
        this._role = role;
        this._organisation = organisation;
    }

    public get id(): string{
        return this._id;
    }
    public set id(val: string){
        this._id = val;
    }

    public get firstName(): string{
        return this._firstName;
    }
    public set firstName(val: string){
        this._firstName = val;
    }

    public get lastName(): string{
        return this._lastName;
    }
    public set lastName(val: string){
        this._lastName = val;
    }

    public get emailAddress(): string{
        return this._emailAddress;
    }
    public set emailAddress(val: string){
        this._emailAddress = val;
    }

    public get role(): string{
        return this._role;
    }
    public set role(val: string){
        this._role = val;
    }

    public get organisation(): OrganisationDetails{
        return this._organisation;
    }
    public set organisation(val: OrganisationDetails){
        this._organisation = val;
    }

}
