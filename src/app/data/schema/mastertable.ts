export interface Mastertable {
    [x: string]: any;
    id: number;
    idType:number;
    idfather:number;
    shortvalue:string;
    descriptionvalue: string;
    comment: string;
    order:number;
    active: boolean;
    idUserRegister: number;
    idUserUpdate: number;
   // descriptionValue: string;
}