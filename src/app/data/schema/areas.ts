export interface Areas {
    id: number;
    idUpperArea: number;
    idEmpresa: number;
    areaPadre: string;
    empresa: string;
    nameArea: string;
    active: boolean;
    state: number;
    idUserRegister: number;
    idUserUpdate: number;
    nid_area:number;
}

export interface FilterArea {
    idEmpresa: number;
    nombreArea: string;
}

export interface AreasByUser {
    nid_area: number;
    nid_person: number;
    idCompania: number;
    idSubArea:number;
    subArea: string;
    idArea:number;
    area: string;
    idGerencia:number;
    gerencia: string;
}

export interface FilterAreaGerencias {
    IdUser: number;
    IdCompany: string;
}