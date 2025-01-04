import { Delivery } from "./delivery.model";
import { Hatching } from "./hatching.model";
import { Nesting } from "./nesting.model";

export class HatchingLoadedDeliveries {

    constructor(
        private _id: string,
        private _hatching: Hatching,
        private _delivery: Delivery,
        private _quantity: number
    ){}

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get hatching(): Hatching {
        return this._hatching;
    }
    public set hatching(value: Hatching) {
        this._hatching = value;
    }
    public get delivery(): Delivery {
        return this._delivery;
    }
    public set delivery(value: Delivery) {
        this._delivery = value;
    }
    public get quantity(): number {
        return this._quantity;
    }
    public set quantity(value: number) {
        this._quantity = value;
    }
}