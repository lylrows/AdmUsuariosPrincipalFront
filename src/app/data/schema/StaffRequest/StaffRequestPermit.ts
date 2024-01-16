import { Time } from "@angular/common";

export interface StaffRequestPermit{
    idTypeStaffRequest: number;
    idPermitType: number;
    support: string;
    permitDate: Date;
    startTime: Time;
    endTime: Time;
}