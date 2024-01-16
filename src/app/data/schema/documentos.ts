export interface Documento {
    id: number;
    idCategory:number;
    idCompany:number;
    idSubCategory:number;
    nameCompany:string;
    nameCategory:string;
    nameSubCategory:string;
    description:string;
    filename: string;
    filenamefolder: string;
    active: boolean;
    idUserRegister: number;
    idUserUpdate: number;
}

export interface FilterDocumento {
    idEmpresa: number;
    idCategory: number;
}