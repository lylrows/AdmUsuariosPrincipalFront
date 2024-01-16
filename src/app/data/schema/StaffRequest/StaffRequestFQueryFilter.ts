import { PaginationFilter } from "../paginationFilter";

export interface StaffRequestQueryFilter {
    idTypeStaffRequest:number;
    initialIssueDate: Date;
    finalIssueDate: Date;
    idEmployee: number; 
    idUser: number;
    idCompany: number;
    idArea: number;
    idStatus: number;
    idStatusApprove: number;
    pagination: PaginationFilter;
}
