export interface AsignEmployee {
    IdCampaign: number;
    Employelist: AssignEmployeeDetailDto[];
}

export interface AssignEmployeeDetailDto {
    IdEmployee: number;
    IdPosition: number;
    Active: boolean
}