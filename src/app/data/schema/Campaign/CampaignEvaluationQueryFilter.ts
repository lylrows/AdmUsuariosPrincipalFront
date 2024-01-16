import { PaginationFilter } from './../paginationFilter';
export interface CampaignEvaluationQueryFilter {
    nidCampana: number;
    CompanyId: number;
    GerenciaId: number;
    AreaId: number;
    SubAreaId: number;
    numberAction: number;
    statusetapa:number;
    pagination: PaginationFilter;
}
