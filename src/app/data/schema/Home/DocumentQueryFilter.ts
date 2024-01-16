import { PaginationFilter } from './../paginationFilter';
export interface DocumentQueryFilter {
    idCompany: number;
    idCategory: number;
    idSubCategory: number;
    pagination: PaginationFilter;
}