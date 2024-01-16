export interface EcoCondition {

    codEmployee: string;
    colaborator: string;
    position: string;
    areaName: string;
    managementName: string;
    condition: string;
    admissionDate: string;
    idEconomicCondition: number;
    basicMonth: number;
    otherFixedMonth: number;
    variableMonth: number;
    passive: number;
    otherUnpaid: number;
    monthlyIncome: number;
    variationMontlyIncome: number;
    annualBonus: number;
    annualCost: number;
    variationAnnualCost: number;

    increase: number;
    increasePassive: number;

    increase_ant: number;
    increasePassive_ant: number;



    prevnid_economic_conditions: number;
    prevBasicMonth: number;
    prevOtherFixedMonth: number;
    prevVariableMonth: number;
    prevPassive: number;
    prevOtherUnpaid: number;
    prevMonthlyIncome: number;
    prevAnnualBonus: number;
    prevAnnualCost: number;

}
