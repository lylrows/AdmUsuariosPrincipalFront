import { PaginationFilter } from './../paginationFilter';
export interface JobQueryFilter {
    idUser: number;
    type: string;
    pagination: PaginationFilter;
}