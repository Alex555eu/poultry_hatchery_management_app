import { Nesting } from "./nesting.model";
import { TaskStatus } from "./task-status-enum";
import { TaskType } from "./task-type.model";

export class Task {
    
    constructor(
        private _id: string,
        private _executionScheduledAt: Date,
        private _executionCompletedAt: Date,
        private _taskStatus: TaskStatus,
        private _taskType: TaskType,
        private _nesting: Nesting,
    ){}

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get executionScheduledAt(): Date {
        return this._executionScheduledAt;
    }
    public set executionScheduledAt(value: Date) {
        this._executionScheduledAt = value;
    }
    public get executionCompletedAt(): Date {
        return this._executionCompletedAt;
    }
    public set executionCompletedAt(value: Date) {
        this._executionCompletedAt = value;
    }
    public get taskStatus(): TaskStatus {
        return this._taskStatus;
    }
    public set taskStatus(value: TaskStatus) {
        this._taskStatus = value;
    }
    public get taskType(): TaskType {
        return this._taskType;
    }
    public set taskType(value: TaskType) {
        this._taskType = value;
    }
    public get nesting(): Nesting {
        return this._nesting;
    }
    public set nesting(value: Nesting) {
        this._nesting = value;
    }

}