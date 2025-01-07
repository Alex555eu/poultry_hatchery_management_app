import { HatchingIncubatorSpace } from "./hatching-incubator-space.model";
import { HatchingTrolley } from "./hatching-trolley.model";

export class HatchingTrolleyIncubatorSpaceAssignment {
    
    constructor(
        private _id: string,
        private _hatchingIncubatorSpace: HatchingIncubatorSpace,
        private _hatchingTrolley: HatchingTrolley,
        private _trolleyExitStamp: Date,
        private _trolleyEneterStamp: Date
    ){}
    
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get hatchingIncubatorSpace(): HatchingIncubatorSpace {
        return this._hatchingIncubatorSpace;
    }
    public set hatchingIncubatorSpace(value: HatchingIncubatorSpace) {
        this._hatchingIncubatorSpace = value;
    }
    public get hatchingTrolley(): HatchingTrolley {
        return this._hatchingTrolley;
    }
    public set hatchingTrolley(value: HatchingTrolley) {
        this._hatchingTrolley = value;
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