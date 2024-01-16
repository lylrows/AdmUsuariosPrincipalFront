export interface Cargo {
    id: number;
    idArea: number;
    idEmpresa: number;
    empresa: string;
    nameArea: string;
    nameCargo: string;
    active: boolean;
    state: number;
    idUserRegister: number;
    idUserUpdate: number;
    idUpperCargo: number;
}

export interface FilterCargo {
    idEmpresa: number;
    idArea: number;
    nombreCargo: string;
}

export interface IPositionList {
    nid_charge: number;
    snamecharge: string;
}

export interface CargoInfo{
    title:string;
    cargo:Cargo;
}