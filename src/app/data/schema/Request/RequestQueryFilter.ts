import { PaginationFilter } from "../paginationFilter";

export interface RequestQueryFilter {
    id: number;
    idbussines: number;
    idgerencia: number;
    idarea: number;
    nidsubarea: number;
    nstate: number;
    dateStart: string;
    dateEnd: string;
    nid_typerequest:number;
    ntypeseccion:number;
    nid_employee:number;
    pagination: PaginationFilter;
}
