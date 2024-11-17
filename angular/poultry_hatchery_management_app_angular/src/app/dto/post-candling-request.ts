import { Nesting } from "../models/nesting.model";

export interface PostCandlingRequest {
    scheduledAt: Date,
    candlingNumber: number,
    nesting: Nesting,
}