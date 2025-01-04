import { NestingLoadedDeliveries } from "./nesting-loaded-deliveries.model";

export class Rejection1 {

    constructor(
        private _id: string,
        private _quantity: number,
        private _cause: string,
        private _nestingLoadedDeliveries: NestingLoadedDeliveries,
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
    public get nestingLoadedDeliveries(): NestingLoadedDeliveries {
        return this._nestingLoadedDeliveries;
    }
    public set nestingLoadedDeliveries(value: NestingLoadedDeliveries) {
        this._nestingLoadedDeliveries = value;
    }

    public equals(ob: Rejection1): boolean {
        if (!(ob instanceof Rejection1)) {
            return false;
        }  
        if (ob === this) {
            return true;
        }
        return  this._id === ob._id && 
                this._quantity === ob._quantity &&
                this._cause === ob._cause &&
                this._nestingLoadedDeliveries.id === ob._nestingLoadedDeliveries.id;
    }

}