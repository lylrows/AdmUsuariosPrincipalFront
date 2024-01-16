import { PaginationFilter } from './../paginationFilter';
export interface CampaignQueryFilter {
    nidCampana: number;
    snamecampaign: string;
    nstatus: number;
    nyear: number;
    nmonth: number;

    pagination: PaginationFilter;
}