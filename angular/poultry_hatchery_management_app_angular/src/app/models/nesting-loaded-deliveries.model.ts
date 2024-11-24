import { Delivery } from "./delivery.model";
import { Nesting } from "./nesting.model";

export class NestingLoadedDeliveries {

    constructor(
        private _id: string,
        private _nesting: Nesting,
        private _delivery: Delivery
    ){}

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get nesting(): Nesting {
        return this._nesting;
    }
    public set nesting(value: Nesting) {
        this._nesting = value;
    }
    public get delivery(): Delivery {
        return this._delivery;
    }
    public set delivery(value: Delivery) {
        this._delivery = value;
    }
}