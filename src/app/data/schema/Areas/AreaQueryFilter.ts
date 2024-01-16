import { PaginationFilter } from './../paginationFilter';
export interface AreaQueryFilter {
    idCompany: number;
    nombreArea: string;
    pagination: PaginationFilter;
}