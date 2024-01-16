export interface TypeStaffRequest{
    id: number;
    name: string;
    description: string;
    url: string;
    active: boolean;
    typeStaffRequestApproverList: any[];
}