import { PaginationFilter } from './../paginationFilter';
export interface CargoQueryFilter {
    idCompany: number;
    idGerencia: number;
    idArea: number;
    idSubArea: number;
    nombreCargo: string;
    estado: string;
    pagination: PaginationFilter;
}