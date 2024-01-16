export interface StaffRequestLoan{
    idTypeStaffRequest: number;
    idTypeLoan: number;
    detailReasonLoan: string;
    amount: number;
    amountMonthlyFee: number;
    numberFee: number;
    staffRequest: any;
}