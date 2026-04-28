export interface IEvent {
    id: string;
    startTime: Date;
    endTime?: Date;
    properties: Record<string, any>;
}