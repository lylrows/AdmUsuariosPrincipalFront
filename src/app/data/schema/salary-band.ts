export interface ISalaryBandExport {
    codigo: string;
    description: string;
    ancho: number;
    horizontal: "distributed" | "justify" | "center" | "left" | "right" | "fill" | "centerContinuous";
    formato:"text"| "money" ;
  }
  export const SALARY_BAND_HEADER_EXPORT: ISalaryBandExport[] = [
    {
        codigo: 'codEmployee',
        description: 'Código',
        ancho: 10,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'colaborator',
        description: 'Nombre',
        ancho: 28,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'position',
        description: 'Cargo',
        ancho: 36,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'areaName',
        description: 'Área',
        ancho: 16,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'categoryName',
        description: 'Categoría',
        ancho: 4,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'admissionDate',
        description: 'Fecha Ingreso',
        ancho: 10,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'yearsService',
        description: 'Años de Servicio',
        ancho: 20,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'basicMonth',
        description: 'Sueldo Básico',
        ancho: 20,
        horizontal: 'right',
        formato: 'money'
    },
    {
        codigo: 'passive',
        description: 'PASI',
        ancho: 20,
        horizontal: 'right',
        formato: 'money'
    },
    {
        codigo: 'averageEarnableIncome',
        description: 'PROMEDIO DE INGRESOS VARIABLES',
        ancho: 20,
        horizontal: 'right',
        formato: 'money'
    },
    {
        codigo: 'otherUnpaid',
        description: 'OTROS INGRESOS NO REMUNERATIVOS',
        ancho: 20,
        horizontal: 'right',
        formato: 'money'
    },
    {
        codigo: 'totalSalary',
        description: 'TOTAL SUELDO',
        ancho: 20,
        horizontal: 'right',
        formato: 'money'
    },
    {
        codigo: 'increase',
        description: 'Incremento Básico',
        ancho: 20,
        horizontal: 'right',
        formato: 'money'
    },
    {
        codigo: 'increasePassive',
        description: 'Incremento de PASI',
        ancho: 20,
        horizontal: 'right',
        formato: 'money'
    },
    {
        codigo: 'increaseUnpaid',
        description: 'Incremento de Ing. No Remun.',
        ancho: 20,
        horizontal: 'right',
        formato: 'money'
    },
    {
        codigo: 'salaryBandAmount',
        description: 'SUELDO PARA BANDA',
        ancho: 20,
        horizontal: 'right',
        formato: 'money'
    },
    {
        codigo: 'totalNewIncome',
        description: 'Total Nuevos Ingresos',
        ancho: 20,
        horizontal: 'right',
        formato: 'money'
    },
    {
        codigo: 'lights',
        description: 'SEMAFORO DE ALERTA',
        ancho: 5,
        horizontal: 'center',
        formato: 'text'
    },
    {
        codigo: 'statusBandText',
        description: 'Estado en Banda',
        ancho: 20,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'minimunPoint',
        description: 'Mínimo S/',
        ancho: 20,
        horizontal: 'right',
        formato: 'money'
    },
    {
        codigo: 'middlePoint',
        description: 'Medio S/',
        ancho: 20,
        horizontal: 'right',
        formato: 'money'
    },
    {
        codigo: 'maximunPoint',
        description: 'Máximo S/',
        ancho: 20,
        horizontal: 'right',
        formato: 'money'
    },
    {
        codigo: 'perBand',
        description: 'PER BANDA %',
        ancho: 20,
        horizontal: 'right',
        formato: 'money'
    },
    {
        codigo: 'banda1',
        description: 'Banda1',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda2',
        description: 'Banda2',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda3',
        description: 'Banda3',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda4',
        description: 'Banda4',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda5',
        description: 'Banda5',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda6',
        description: 'Banda6',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda7',
        description: 'Banda7',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda8',
        description: 'Banda8',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda9',
        description: 'Banda9',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda10',
        description: 'Banda10',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda11',
        description: 'Banda11',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda12',
        description: 'Banda12',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda13',
        description: 'Banda13',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda14',
        description: 'Banda14',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda15',
        description: 'Banda15',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda16',
        description: 'Banda16',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda17',
        description: 'Banda17',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda18',
        description: 'Banda18',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda19',
        description: 'Banda19',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda20',
        description: 'Banda20',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda21',
        description: 'Banda21',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    {
        codigo: 'banda22',
        description: 'Banda22',
        ancho: 2.33,
        horizontal: 'left',
        formato: 'text'
    },
    // {
    //     codigo: 'areaName',
    //     description: 'Estado',
    //     ancho: 20,
    //     horizontal: 'left'
    // },
];