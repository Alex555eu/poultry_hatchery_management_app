import { HatchingResult } from "./hatching-result.model";

export class Rejection4 {

    constructor(
        private _id: string,
        private _quantity: number,
        private _cause: string,
        private _hatchingResult: HatchingResult,
    ){}

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get quantity(): number {
        return this._quantity;
    }
    public set quantity(value: number) {
        this._quantity = value;
    }
    public get cause(): string {
        return this._cause;
    }
    public set cause(value: string) {
        this._cause = value;
    }
    public get hatchingResult(): HatchingResult {
        return this._hatchingResult;
    }
    public set hatchingResult(value: HatchingResult) {
        this._hatchingResult = value;
    }


    public equals(ob: Rejection4): boolean {
        if (!(ob instanceof Rejection4)) {
            return false;
        }  
        if (ob === this) {
            return true;
        }
        return  this._id === ob._id && 
                this._quantity === ob._quantity &&
                this._cause === ob._cause &&
                this._hatchingResult.id === ob._hatchingResult.id;
    }

}