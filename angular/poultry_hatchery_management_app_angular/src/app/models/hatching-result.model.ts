import { Delivery } from "./delivery.model";
import { HatchingLoadedDeliveries } from "./hatching-loaded-deliveries.model";

export class HatchingResult {

    constructor(
        private _id: string,
        private _hatchingLoadedDeliveries: HatchingLoadedDeliveries,
        private _quantity: number
    ){}

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get hatchingLoadedDeliveries(): HatchingLoadedDeliveries {
        return this._hatchingLoadedDeliveries;
    }
    public set hatchingLoadedDeliveries(value: HatchingLoadedDeliveries) {
        this._hatchingLoadedDeliveries = value;
    }
    public get quantity(): number {
        return this._quantity;
    }
    public set quantity(value: number) {
        this._quantity = value;
    }
}