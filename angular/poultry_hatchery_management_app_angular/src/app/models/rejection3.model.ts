import { CandlingNestingTrolleyAssignment } from "./candling-nesting-trolley-assignment.model";
import { HatchingLoadedDeliveries } from "./hatching-loaded-deliveries.model";
import { NestingLoadedDeliveries } from "./nesting-loaded-deliveries.model";

export class Rejection3 {

    constructor(
        private _id: string,
        private _quantity: number,
        private _cause: string,
        private _hatchingLoadedDeliveries: HatchingLoadedDeliveries,
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
    public get hatchingLoadedDeliveries(): HatchingLoadedDeliveries {
        return this._hatchingLoadedDeliveries;
    }
    public set hatchingLoadedDeliveries(value: HatchingLoadedDeliveries) {
        this._hatchingLoadedDeliveries = value;
    }

    public equals(ob: Rejection3): boolean {
        if (!(ob instanceof Rejection3)) {
            return false;
        }  
        if (ob === this) {
            return true;
        }
        return  this._id === ob._id && 
                this._quantity === ob._quantity &&
                this._cause === ob._cause &&
                this._hatchingLoadedDeliveries.id === ob._hatchingLoadedDeliveries.id;
    }

}