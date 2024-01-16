import { PaginationFilter } from './../paginationFilter';
export interface EmployeAsignQueryFilter {
    nidCampana: number;
    nidcompany:number;
    nidgerencia:number;
    nidArea:number;
    nidsubarea:number;
    Dni: string;
    Name:string;
    Position: number;
    nflagSearch: number;
    pagination: PaginationFilter;
}
