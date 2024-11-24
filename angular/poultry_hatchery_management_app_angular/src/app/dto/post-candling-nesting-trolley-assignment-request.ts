import { Candling } from "../models/candling.model";
import { NestingTrolley } from "../models/nesting-trolley.model";

export interface PostCandlingNestingTrolleyAssignmentRequest {
    candling: Candling,
    nestingTrolley: NestingTrolley
}