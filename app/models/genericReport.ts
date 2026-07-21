export interface IGenericReport {
    id?: string;
    type?: string;
    number?: number;
    creationDate?: Date;
    creator: any;
    overview?: Record<string, any>;
    detail?: Record<string, any>;
}