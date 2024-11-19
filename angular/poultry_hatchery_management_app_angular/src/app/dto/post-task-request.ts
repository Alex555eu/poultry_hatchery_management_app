export interface PostTaskRequest {
    nestingId: string, 
    taskTypeId: string,
    executionDateTime: Date, 
    comment: string
}