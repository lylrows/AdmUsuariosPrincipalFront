import { PaginationFilter } from './../paginationFilter';
export interface MyEvaluationQueryFilter {
    nidCampana: number;
    nidEmployee:number;
    flat:boolean;
    nid_position:number;
    nid_profile:number;
    companyid:number;
    gerenciaid: number;
    areaid:number;
    subareaid:number;
    list_employee:string;
    etapa:number;

    pagination: PaginationFilter;
}
