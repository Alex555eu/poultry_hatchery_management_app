import { ProductType } from "./product-type.model";
import { Supplier } from "./supplier.model";

export class Delivery {

    constructor(
        private _id: string,
        private _dateTime: Date,
        private _quantity: number,
        private _productType: ProductType,
        private _supplier: Supplier
    ) {}


    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get dateTime(): Date {
        return this._dateTime;
    }
    public set dateTime(value: Date) {
        this._dateTime = value;
    }
    public get quantity(): number {
        return this._quantity;
    }
    public set quantity(value: number) {
        this._quantity = value;
    }
    public get productType(): ProductType {
        return this._productType;
    }
    public set productType(value: ProductType) {
        this._productType = value;
    }
    public get supplier(): Supplier {
        return this._supplier;
    }
    public set supplier(value: Supplier) {
        this._supplier = value;
    }
    

}