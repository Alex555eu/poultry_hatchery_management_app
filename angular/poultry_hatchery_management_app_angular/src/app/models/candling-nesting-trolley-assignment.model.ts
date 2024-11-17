import { NestingTrolley } from "./nesting-trolley.model";

export class Candling {

    constructor(
        private _id: string,
        private _candling: Candling,
        private _nestingTrolley: NestingTrolley,
    ){}

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get candling(): Candling {
        return this._candling;
    }
    public set candling(value: Candling) {
        this._candling = value;
    }
    public get nestingTrolley(): NestingTrolley {
        return this._nestingTrolley;
    }
    public set nestingTrolley(value: NestingTrolley) {
        this._nestingTrolley = value;
    }
    
}