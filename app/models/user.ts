export interface IUser {
    name: string;
    displayName: string;
    ldapName: string;
    ldapAuthentication: boolean;
    defaultProject: string;
}