export interface IEvent {
    startTime: Date;
    endTime?: Date;
    properties: Record<string, any>;
}