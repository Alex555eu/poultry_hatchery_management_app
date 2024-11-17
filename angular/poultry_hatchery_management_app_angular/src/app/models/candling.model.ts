import { Nesting } from "./nesting.model";

export class Candling {

    constructor(
        private _id: string,
        private _scheduledAt: Date,
        private _candlingNumber: number,
        private _nesting: Nesting,
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
    
}