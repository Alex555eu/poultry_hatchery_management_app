import { OrganisationDetails } from "./organisation-details.model";
import { TaskSchedule } from "./task-schedule.model";
import { TaskType } from "./task-type.model";

export class TaskScheduleDetails {

    constructor(
        private _id: string,
        private _taskExecutionOrderNumber: number,
        private _daysOffsetFromPrevTask: number,
        private _taskSchedule: TaskSchedule,
        private _taskType: TaskType,
    ){}
    
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get taskExecutionOrderNumber(): number {
        return this._taskExecutionOrderNumber;
    }
    public set taskExecutionOrderNumber(value: number) {
        this._taskExecutionOrderNumber = value;
    }
    public get daysOffsetFromPrevTask(): number {
        return this._daysOffsetFromPrevTask;
    }
    public set daysOffsetFromPrevTask(value: number) {
        this._daysOffsetFromPrevTask = value;
    }

    public get taskSchedule(): TaskSchedule {
        return this._taskSchedule;
    }
    public set taskSchedule(value: TaskSchedule) {
        this._taskSchedule = value;
    }
    public get taskType(): TaskType {
        return this._taskType;
    }
    public set taskType(value: TaskType) {
        this._taskType = value;
    }
    
}