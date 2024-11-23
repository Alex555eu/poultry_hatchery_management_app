import { CandlingNestingTrolleyAssignment } from "./candling-nesting-trolley-assignment.model";
import { NestingTrolleyContent } from "./nesting-trolley-content.model";

export class Rejection2 {

    constructor(
        private _id: string,
        private _quantity: number,
        private _cause: string,
        private _candlingNestingTrolleyAssignment: CandlingNestingTrolleyAssignment,
        private _nestingTrolleyContent: NestingTrolleyContent,
    ){}

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get quantity(): number {
        return this._quantity;
    }
    public set quantity(value: number) {
        this._quantity = value;
    }
    public get cause(): string {
        return this._cause;
    }
    public set cause(value: string) {
        this._cause = value;
    }
    public get candlingNestingTrolleyAssignment(): CandlingNestingTrolleyAssignment {
        return this._candlingNestingTrolleyAssignment;
    }
    public set candlingNestingTrolleyAssignment(value: CandlingNestingTrolleyAssignment) {
        this._candlingNestingTrolleyAssignment = value;
    }
    public get nestingTrolleyContent(): NestingTrolleyContent {
        return this._nestingTrolleyContent;
    }
    public set nestingTrolleyContent(value: NestingTrolleyContent) {
        this._nestingTrolleyContent = value;
    }

    public equals(ob: Rejection2): boolean {
        if (!(ob instanceof Rejection2)) {
            return false;
        }  
        if (ob === this) {
            return true;
        }
        return  this._id === ob._id && 
                this._quantity === ob._quantity &&
                this._cause === ob._cause &&
                this._nestingTrolleyContent.id === ob._nestingTrolleyContent.id;
    }

}