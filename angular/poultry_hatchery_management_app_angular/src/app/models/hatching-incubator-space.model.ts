import { HatchingIncubator } from "./hatching-incubator.model";
import { NestingIncubator } from "./nesting-incubator.model";

export class HatchingIncubatorSpace {

    constructor(
        private _id: string,
        private _humanReadableId: string,
        private _isCurrentlyOccupied: boolean,
        private _hatchingIncubator: HatchingIncubator,
    ){}
    
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get humanReadableId(): string {
        return this._humanReadableId;
    }
    public set humanReadableId(value: string) {
        this._humanReadableId = value;
    }
    public get isCurrentlyOccupied(): boolean {
        return this._isCurrentlyOccupied;
    }
    public set isCurrentlyOccupied(value: boolean) {
        this._isCurrentlyOccupied = value;
    }
    public get hatchingIncubator(): HatchingIncubator {
        return this._hatchingIncubator;
    }
    public set hatchingIncubator(value: HatchingIncubator) {
        this._hatchingIncubator = value;
    }

}