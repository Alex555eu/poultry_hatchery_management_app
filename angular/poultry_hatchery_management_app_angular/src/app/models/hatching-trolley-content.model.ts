import { HatchingLoadedDeliveries } from "./hatching-loaded-deliveries.model";
import { HatchingTrolley } from "./hatching-trolley.model";

export class HatchingTrolleyContent {
    
    constructor(
        private _id: string,
        private _quantity: number,
        private _hatchingTrolley: HatchingTrolley,
        private _hatchingLoadedDeliveries: HatchingLoadedDeliveries
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
    public get hatchingTrolley(): HatchingTrolley {
        return this._hatchingTrolley;
    }
    public set hatchingTrolley(value: HatchingTrolley) {
        this._hatchingTrolley = value;
    }
    public get hatchingLoadedDeliveries(): HatchingLoadedDeliveries {
        return this._hatchingLoadedDeliveries;
    }
    public set hatchingLoadedDeliveries(value: HatchingLoadedDeliveries) {
        this._hatchingLoadedDeliveries = value;
    }

    public equals(ob: HatchingTrolleyContent): boolean {
        if (!(ob instanceof HatchingTrolleyContent)) {
            return false;
        }  
        if (ob === this) {
            return true;
        }
        return  this._id === ob._id && 
                this._quantity === ob._quantity;
    }

}