import { NestingIncubatorSpace } from "./nesting-incubator-space.model";
import { NestingTrolley } from "./nesting-trolley.model";

export class NestingTrolleyIncubatorSpaceAssignment {
    
    constructor(
        private _id: string,
        private _nestingIncubatorSpace: NestingIncubatorSpace,
        private _nestingTrolley: NestingTrolley,
        private _trolleyExitStamp: Date,
        private _trolleyEneterStamp: Date
    ){}
    
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get nestingIncubatorSpace(): NestingIncubatorSpace {
        return this._nestingIncubatorSpace;
    }
    public set nestingIncubatorSpace(value: NestingIncubatorSpace) {
        this._nestingIncubatorSpace = value;
    }
    public get nestingTrolley(): NestingTrolley {
        return this._nestingTrolley;
    }
    public set nestingTrolley(value: NestingTrolley) {
        this._nestingTrolley = value;
    }
    public get trolleyExitStamp(): Date {
        return this._trolleyExitStamp;
    }
    public set trolleyExitStamp(value: Date) {
        this._trolleyExitStamp = value;
    }
    public get trolleyEneterStamp(): Date {
        return this._trolleyEneterStamp;
    }
    public set trolleyEneterStamp(value: Date) {
        this._trolleyEneterStamp = value;
    }

}