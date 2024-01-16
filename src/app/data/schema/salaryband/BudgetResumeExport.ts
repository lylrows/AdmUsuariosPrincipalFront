export interface IBudgetResumeExport {
    codigo: string;
    description: string;
    ancho: number;
    horizontal: "distributed" | "justify" | "center" | "left" | "right" | "fill" | "centerContinuous";
    formato:"text"| "money" ;
  }
  export const SALARY_BAND_HEADER_EXPORT: IBudgetResumeExport[] = [
    {codigo: 'nameArea',description:'AREA',ancho: 30,horizontal:'left',formato:'text'}
    ,{codigo: 'previousExecAmount2',description:'EJECUTADO previousPeriod-2 ',ancho: 16,horizontal:'right',formato:'money'}
    ,{codigo: 'previousExecAmount1',description:'EJECUTADO previousPeriod-1 ',ancho: 16,horizontal:'right',formato:'money'}
    ,{codigo: 'previousExecAmount',description:'EJECUTADO previousPeriod',ancho: 16,horizontal:'right',formato:'money'}
    ,{codigo: 'currentExecAmount',description:'EJECUTADO currentPeriod',ancho: 16,horizontal:'right',formato:'money'}
    ,{codigo: 'previousAmount',description:'PRESUPUESTO previousPeriod',ancho: 16,horizontal:'right',formato:'money'}
    ,{codigo: 'currentAmount',description:'PRESUPUESTO currentPeriod',ancho: 16,horizontal:'right',formato:'money'}
    ,{codigo: 'variationPorc',description:'VAR  %',ancho: 16,horizontal:'right',formato:'money'}
    ,{codigo: 'variationAmount',description:'VAR S/.',ancho: 16,horizontal:'right',formato:'money'}

];