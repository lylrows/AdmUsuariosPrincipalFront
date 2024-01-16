export interface IEcoConditionExport {
    codigo: string;
    description: string;
    ancho: number;
    horizontal: "distributed" | "justify" | "center" | "left" | "right" | "fill" | "centerContinuous";
    formato:"text"| "money" ;
  }
  export const SALARY_BAND_HEADER_EXPORT: IEcoConditionExport[] = [
    {codigo: 'codEmployee',description:'CÓDIGO',ancho: 10.5,horizontal:'left',formato:'text'}
    ,{codigo: 'colaborator',description:'COLABORADOR',ancho: 48.7,horizontal:'left',formato:'text'}
    ,{codigo: 'position',description:'CARGO',ancho: 41.9,horizontal:'left',formato:'text'}
    ,{codigo: 'areaName',description:'AREA',ancho: 35,horizontal:'left',formato:'text'}
    ,{codigo: 'condition',description:'CONDICIÓN',ancho: 24.1,horizontal:'left',formato:'text'}
    ,{codigo: 'admissionDate',description:'FECHA DE INGRESO',ancho: 17,horizontal:'left',formato:'text'}
    ,{codigo: 'spaceText',description:'ESPACIO1',ancho: 3,horizontal:'left',formato:'text'}
    ,{codigo: 'prevBasicMonth',description:'BÁSICO MES',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'prevOtherFixedMonth',description:'OTROS FIJOS MES',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'prevVariableMonth',description:'VARIABLE MES',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'prevPassive',description:'PASI',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'prevOtherUnpaid',description:'OTROS NO REMUNER.',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'prevMonthlyIncome',description:'INGRESO MES',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'prevAnnualBonus',description:'BONO ANUAL',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'prevAnnualCost',description:'COSTO ANUAL',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'spaceText',description:'ESPACIO2',ancho: 3,horizontal:'left',formato:'text'}
    ,{codigo: 'variationMontlyIncome',description:'VARIAC. INGRESO MES',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'spaceText',description:'ESPACIO3',ancho: 3,horizontal:'left',formato:'text'}
    ,{codigo: 'presupuestado',description:'PRESUPUESTADO',ancho: 15,horizontal:'left',formato:'text'}
    ,{codigo: 'basicMonth',description:'BÁSICO MES 2',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'increase',description:'INCREMENTO',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'otherFixedMonth',description:'OTROS FIJOS MES 2',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'variableMonth',description:'VARIABLE MES 2',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'passive',description:'PASI 2',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'increasePassive',description:'INCREMENTO PASI',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'otherUnpaid',description:'OTROS NO REMUNER. 2',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'monthlyIncome',description:'INGRESO MES 2',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'annualBonus',description:'BONO ANUAL 2',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'annualCost',description:'COSTO ANUAL 2',ancho: 13,horizontal:'right',formato:'money'}
    ,{codigo: 'spaceText',description:'ESPACIO4',ancho: 3,horizontal:'left',formato:'text'}
    ,{codigo: 'variationAnnualCost',description:'VARIAC. COSTO ANUAL',ancho: 13,horizontal:'right',formato:'money'}
    

];