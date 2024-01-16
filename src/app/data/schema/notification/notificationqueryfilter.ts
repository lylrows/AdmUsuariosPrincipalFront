import { PaginationFilter } from "../paginationFilter";

export interface NotificationQueryFilter {
    idCompany: number;
    idArea: number;
    subject: string;
    pagination: PaginationFilter;
}

export interface NotificationBandejaQueryFilter {
    semisor: string;
    ssubject: string;
    sstartdate: Date;
    senddate: Date;
    niduser: number;
    pagination: PaginationFilter;
}