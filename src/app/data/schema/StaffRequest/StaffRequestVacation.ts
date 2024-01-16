export interface StaffRequestVacation{
    idTypeStaffRequest: number;
    startVacation: Date;
    endVacation: Date;
    numberCalendarDays: number;
    numberBusinessDays: number;
    vacationPeriod: string;
    staffRequest: any;
}