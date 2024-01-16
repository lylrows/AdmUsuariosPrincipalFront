import { PaginationFilter } from './../paginationFilter';
export interface JobInternalQueryFilter {
    idEmpresa: number;
    idGerencia: number;
    idArea: number;
    idJobType: number;
    pagination: PaginationFilter;
}