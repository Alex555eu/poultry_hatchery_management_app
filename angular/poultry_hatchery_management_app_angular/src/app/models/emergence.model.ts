import { Hatching } from "./hatching.model";
import { Nesting } from "./nesting.model";
import { Task } from "./task.model";

export class Emergence {


    constructor(
        private _id: string,
        private _dateTime: Date,
        private _hatching: Hatching,
        private _task: Task,
    ){}

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
    public get hatching(): Hatching {
        return this._hatching;
    }
    public set hatching(value: Hatching) {
        this._hatching = value;
    }
    public get task(): Task {
        return this._task;
    }
    public set task(value: Task) {
        this._task = value;
    }
    
}