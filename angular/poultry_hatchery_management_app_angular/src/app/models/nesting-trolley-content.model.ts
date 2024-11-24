import { NestingLoadedDeliveries } from "./nesting-loaded-deliveries.model";
import { NestingTrolley } from "./nesting-trolley.model";

export class NestingTrolleyContent {
    
    constructor(
        private _id: string,
        private _quantity: number,
        private _nestingTrolley: NestingTrolley,
        private _nestingLoadedDeliveries: NestingLoadedDeliveries
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
    public get nestingTrolley(): NestingTrolley {
        return this._nestingTrolley;
    }
    public set nestingTrolley(value: NestingTrolley) {
        this._nestingTrolley = value;
    }
    public get nestingLoadedDeliveries(): NestingLoadedDeliveries {
        return this._nestingLoadedDeliveries;
    }
    public set nestingLoadedDeliveries(value: NestingLoadedDeliveries) {
        this._nestingLoadedDeliveries = value;
    }

    public equals(ob: NestingTrolleyContent): boolean {
        if (!(ob instanceof NestingTrolleyContent)) {
            return false;
        }  
        if (ob === this) {
            return true;
        }
        return  this._id === ob._id && 
                this._quantity === ob._quantity;
    }

}