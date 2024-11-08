import { NestingTrolley } from "./nesting-trolley.model";
import { Task } from "./task.model";
import { UserDetails } from "./user-details.model";

export class TaskNestingTrolleyAssignment {

    constructor(
        private _id: string,
        private _isTaskCompleted: boolean,
        private _task: Task,
        private _nestingTrolley: NestingTrolley,
        private _executor: UserDetails,
    ){}
    
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get isTaskCompleted(): boolean {
        return this._isTaskCompleted;
    }
    public set isTaskCompleted(value: boolean) {
        this._isTaskCompleted = value;
    }
    public get task(): Task {
        return this._task;
    }
    public set task(value: Task) {
        this._task = value;
    }
    public get nestingTrolley(): NestingTrolley {
        return this._nestingTrolley;
    }
    public set nestingTrolley(value: NestingTrolley) {
        this._nestingTrolley = value;
    }
    public get executor(): UserDetails {
        return this._executor;
    }
    public set executor(value: UserDetails) {
        this._executor = value;
    }

}