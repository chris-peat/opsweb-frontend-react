export interface IUser {
    id: string;
    name: string;
    displayName: string;
    ldapName: string;
    ldapAuthentication: boolean;
    defaultProject: string;
}