import { Injectable } from '@angular/core';
import { IEcoConditionExport } from '@app/data/schema/salaryband/EcoConditionExport';
import { Workbook } from 'exceljs';
import  * as fs  from 'file-saver';


const EXCEL_EXTENSION = '.xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTR-8';
@Injectable({
  providedIn: 'root'
})
export class SBEcoCondExportService {

  constructor() { }

  public export(
    headerExport: IEcoConditionExport[],
    excelFileName: string,
    sheetName: string,
    data?: any[],
    periodo?:any,
    title?:string
  )
  {
    
    const header:any[] = [];
    const keysdata: any[] = [];

    headerExport.forEach(element => {
      header.push(element.description),
      keysdata.push(element.codigo)
    });

    const content = data;

    const documento = new Workbook();
    documento.created = new Date();
    documento.modified = new Date();

    const worksheet = documento.addWorksheet(sheetName);

    // BORDE CELDAS
    var borderStyles = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    };

    // TITULO PRINCIPAL
    worksheet.mergeCells('A1:AE1');
    const titulo_info = worksheet.getCell('A1');
    titulo_info.value = title; 
    titulo_info.fill={type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '99CCFF'},
          bgColor: { argb: '99CCFF'},
        };
    titulo_info.font = { name: 'Arial Narrow',
        family: 2,
        size: 24,
        color: { argb: '000000' },
        bold:true,
      };
    titulo_info.alignment = { vertical: 'middle', horizontal: 'center'};
    titulo_info.border={top:{style:"thin"},
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }};




    // CABECERA MANUAL
    const row = worksheet.getRow(5);
      row.height=20;
      // TEXTO CODIGO
       worksheet.mergeCells('A4:A5');
      const cabecera_codigo = worksheet.getCell('A4');
      cabecera_codigo.value = "CÓDIGO"; 
      cabecera_codigo.fill={type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F2F2F2'},
            bgColor: { argb: 'F2F2F2'},
      };
      cabecera_codigo.font =  { name: 'Calibri',family: 2,size:7, bold:true, color: { argb: '000000' } };
      cabecera_codigo.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true};
      cabecera_codigo.border={ ...titulo_info.border}

      // TEXTO NOMBRE
      worksheet.mergeCells('B4:B5');
      const cabecera_nombre = worksheet.getCell('B4');
      cabecera_nombre.value = "COLABORADOR"; 
      cabecera_nombre.fill={...cabecera_codigo.fill
      };
      cabecera_nombre.font =  {... cabecera_codigo.font};
      cabecera_nombre.alignment = { ...cabecera_codigo.alignment};
      cabecera_nombre.border={ ...titulo_info.border}

      // TEXTO CARGO
      worksheet.mergeCells('C4:C5');
      const cabecera_cargo = worksheet.getCell('C4');
      cabecera_cargo.value = "CARGO"; 
      cabecera_cargo.fill={...cabecera_codigo.fill
      };
      cabecera_cargo.font =  {... cabecera_codigo.font};
      cabecera_cargo.alignment = { ...cabecera_codigo.alignment};
      cabecera_cargo.border={ ...titulo_info.border}
      // TEXTO AREA
      worksheet.mergeCells('D4:D5');
      const cabecera_area = worksheet.getCell('D4');
      cabecera_area.value = "AREA"; 
      cabecera_area.fill={...cabecera_codigo.fill
      };
      cabecera_area.font =  {... cabecera_codigo.font};
      cabecera_area.alignment = { ...cabecera_codigo.alignment};
      cabecera_area.border={ ...titulo_info.border}

      // TEXTO CONDICIÓN
      worksheet.mergeCells('E4:E5');
      const cabecera_categoria = worksheet.getCell('E4');
      cabecera_categoria.value = "CONDICIÓN"; 
      cabecera_categoria.fill={...cabecera_codigo.fill
      };
      cabecera_categoria.font =  {... cabecera_codigo.font};
      cabecera_categoria.alignment = { ...cabecera_codigo.alignment};
      cabecera_categoria.border={ ...titulo_info.border}

      // FECHA DE INGRESO
      worksheet.mergeCells('F4:F5');
      const cabecera_fecha_ingreso = worksheet.getCell('F4');
      cabecera_fecha_ingreso.value = "FECHA DE INGRESO"; 
      cabecera_fecha_ingreso.fill={...cabecera_codigo.fill
      };
      cabecera_fecha_ingreso.font =  {... cabecera_codigo.font};
      cabecera_fecha_ingreso.alignment = { ...cabecera_codigo.alignment};
      cabecera_fecha_ingreso.border={ ...titulo_info.border}


       // TEXTO ESPACIO
       //worksheet.mergeCells('G4:G5');
      const cabecera_anios_servicio = worksheet.getCell('G4');
      cabecera_anios_servicio.value = ""; 
      cabecera_anios_servicio.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'FFFFFF'},
        bgColor: { argb: 'FFFFFF'},
      };
      cabecera_anios_servicio.font =  {... cabecera_codigo.font};
      cabecera_anios_servicio.alignment = { ...cabecera_codigo.alignment};
      //cabecera_anios_servicio.border={ ...titulo_info.border}

      cabecera_anios_servicio.border={};


     // TEXTO AL CIERRE DEL AÑO @PERIODOANTERIOR

      worksheet.mergeCells('H4:O4');
      const cabecera_TituloAlcierreAnterior = worksheet.getCell('H4');
      cabecera_TituloAlcierreAnterior.value = "AL CIERRE DEL AÑO "  + (periodo-1); 
      cabecera_TituloAlcierreAnterior.fill={...cabecera_codigo.fill,        fgColor: { argb: 'DEEAF6'},        bgColor: { argb: 'DEEAF6'},      };
      cabecera_TituloAlcierreAnterior.font =  {... cabecera_codigo.font};
      cabecera_TituloAlcierreAnterior.alignment = { ...cabecera_codigo.alignment};
      cabecera_TituloAlcierreAnterior.border={ ...titulo_info.border}






      // TEXTO AÑOS DE SERVICIO
      // worksheet.mergeCells('F5');
      const cabecera_sueldo_basico = worksheet.getCell('H5');
      cabecera_sueldo_basico.value = "BASICO MES"; 
      cabecera_sueldo_basico.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'DEEAF6'},
        bgColor: { argb: 'DEEAF6'},
      };
      cabecera_sueldo_basico.font =  {... cabecera_codigo.font};
      cabecera_sueldo_basico.alignment = { ...cabecera_codigo.alignment};
      cabecera_sueldo_basico.border={ ...titulo_info.border}
      // TEXTO PASI
      // worksheet.mergeCells('F5');
      const cabecera_pasi = worksheet.getCell('I5');
      cabecera_pasi.value = "OTROS FIJOS MES"; 
      cabecera_pasi.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'DEEAF6'},
        bgColor: { argb: 'DEEAF6'},
      };
      cabecera_pasi.font =  {... cabecera_codigo.font};
      cabecera_pasi.alignment = { ...cabecera_codigo.alignment};
      cabecera_pasi.border={ ...titulo_info.border}

      // TEXTO PROMEDIO INGRESOS VARIABLES
      // worksheet.mergeCells('F5');
      const cabecera_promedio_ingreso_variable = worksheet.getCell('J5');
      cabecera_promedio_ingreso_variable.value = "VARIABLE MES"; 
      cabecera_promedio_ingreso_variable.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'DEEAF6'},
        bgColor: { argb: 'DEEAF6'},
      };
      cabecera_promedio_ingreso_variable.font =  {... cabecera_codigo.font};
      cabecera_promedio_ingreso_variable.alignment = { ...cabecera_codigo.alignment};
      cabecera_promedio_ingreso_variable.border={ ...titulo_info.border}

      // TEXTO PROMEDIO INGRESOS VARIABLES
      // worksheet.mergeCells('F5');
      const cabecera_ingresos_no_remunerativos = worksheet.getCell('K5');
      cabecera_ingresos_no_remunerativos.value = "PASI"; 
      cabecera_ingresos_no_remunerativos.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'DEEAF6'},
        bgColor: { argb: 'DEEAF6'},
      };
      cabecera_ingresos_no_remunerativos.font =  {... cabecera_codigo.font};
      cabecera_ingresos_no_remunerativos.alignment = { ...cabecera_codigo.alignment};
      cabecera_ingresos_no_remunerativos.border={ ...titulo_info.border}

      // TEXTO TOTAL SUELDO
      // worksheet.mergeCells('F5');
      const cabecera_total_sueldo = worksheet.getCell('L5');
      cabecera_total_sueldo.value = "OTROS NO REMUNER."; 
      cabecera_total_sueldo.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'DEEAF6'},
        bgColor: { argb: 'DEEAF6'},
      };
      cabecera_total_sueldo.font =  {... cabecera_codigo.font};
      cabecera_total_sueldo.alignment = { ...cabecera_codigo.alignment};
      cabecera_total_sueldo.border={ ...titulo_info.border}
      // TEXTO INCREMENTO BASICO
      // worksheet.mergeCells('F5');
      const cabecera_incremento_basico = worksheet.getCell('M5');
      cabecera_incremento_basico.value = "INGRESO MES"; 
      cabecera_incremento_basico.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'DEEAF6'},
        bgColor: { argb: 'DEEAF6'},
      };
      cabecera_incremento_basico.font =  {... cabecera_codigo.font};
      cabecera_incremento_basico.alignment = { ...cabecera_codigo.alignment};
      cabecera_incremento_basico.border={ ...titulo_info.border}
      // TEXTO INCREMENTO PASI
      // worksheet.mergeCells('F5');
      const cabecera_incremento_pasi = worksheet.getCell('N5');
      cabecera_incremento_pasi.value = "BONO ANUAL"; 
      cabecera_incremento_pasi.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'DEEAF6'},
        bgColor: { argb: 'DEEAF6'},};
      cabecera_incremento_pasi.font =  {... cabecera_codigo.font};
      cabecera_incremento_pasi.alignment = { ...cabecera_codigo.alignment};
      cabecera_incremento_pasi.border={ ...titulo_info.border}
      // TEXTO INCREMENTO INGRESO NO REMUNERATIVO
      // worksheet.mergeCells('F5');
      const cabecera_incremento_ing_no_remun = worksheet.getCell('O5');
      cabecera_incremento_ing_no_remun.value = "COSTO ANUAL"; 
      cabecera_incremento_ing_no_remun.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'DEEAF6'},
        bgColor: { argb: 'DEEAF6'},};
      cabecera_incremento_ing_no_remun.font =  {... cabecera_codigo.font};
      cabecera_incremento_ing_no_remun.alignment = { ...cabecera_codigo.alignment};
      cabecera_incremento_ing_no_remun.border={ ...titulo_info.border}
      // TEXTO SUELDO PARA BANDA
      // worksheet.mergeCells('F5');
      const cabecera_sueldo_banda = worksheet.getCell('P5');
      cabecera_sueldo_banda.value = ""; 
      cabecera_sueldo_banda.fill={...cabecera_codigo.fill,fgColor: { argb: 'FFFFFF'},bgColor: { argb: 'FFFFFF'},};
      cabecera_sueldo_banda.font =  {... cabecera_codigo.font};
      cabecera_sueldo_banda.alignment = { ...cabecera_codigo.alignment};
      cabecera_sueldo_banda.border={ }  

      // TEXTO INGRESO NO REMUNERATIVO
       worksheet.mergeCells('Q4:Q5');
      const cabecera_total_nuevos_ingresos = worksheet.getCell('Q4');
      cabecera_total_nuevos_ingresos.value = "VARIAC. INGRESO MES"; 
      cabecera_total_nuevos_ingresos.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'FFF2CB'},
        bgColor: { argb: 'FFF2CB'},};
      cabecera_total_nuevos_ingresos.font =  {... cabecera_codigo.font};
      cabecera_total_nuevos_ingresos.alignment = { ...cabecera_codigo.alignment};
      cabecera_total_nuevos_ingresos.border={ ...titulo_info.border}    


      // TEXTO SEMAFORO DE ALERTA
      // worksheet.mergeCells('F5');
      const cabecera_semaforo_alerta = worksheet.getCell('R5');
      cabecera_semaforo_alerta.value = ""; 
      cabecera_semaforo_alerta.fill={...cabecera_codigo.fill,fgColor: { argb: 'FFFFFF'},bgColor: { argb: 'FFFFFF'},};
      cabecera_semaforo_alerta.font =  {... cabecera_codigo.font};
      cabecera_semaforo_alerta.alignment = { ...cabecera_codigo.alignment};
      cabecera_semaforo_alerta.border={}  



     // TEXTO AL CIERRE DEL AÑO @PERIODOACTUAL

      worksheet.mergeCells('S4:AC4');
      const cabecera_TituloAlcierreActual = worksheet.getCell('S4');
      cabecera_TituloAlcierreActual.value = "AÑO "+periodo; 
      cabecera_TituloAlcierreActual.fill={...cabecera_codigo.fill,        fgColor: { argb: 'E2EEDA'},        bgColor: { argb: 'E2EEDA'},      };
      cabecera_TituloAlcierreActual.font =  {... cabecera_codigo.font};
      cabecera_TituloAlcierreActual.alignment = { ...cabecera_codigo.alignment};
      cabecera_TituloAlcierreActual.border={ ...titulo_info.border}



      // TEXTO ESTADO BANDA
      // worksheet.mergeCells('F5');
      const cabeceraPresupuestado = worksheet.getCell('S5');
      cabeceraPresupuestado.value = "PRESUPUESTADO"; 
      cabeceraPresupuestado.fill={...cabecera_codigo.fill,        fgColor: { argb: 'E2EEDA'},        bgColor: { argb: 'E2EEDA'},};
      cabeceraPresupuestado.font =  {... cabecera_codigo.font};
      cabeceraPresupuestado.alignment = { ...cabecera_codigo.alignment};
      cabeceraPresupuestado.border={ ...titulo_info.border} 



      // TEXTO ESTADO BANDA
      // worksheet.mergeCells('F5');
      const cabecera_estado_banda = worksheet.getCell('T5');
      cabecera_estado_banda.value = "BÁSICO MES"; 
      cabecera_estado_banda.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'E2EEDA'},
        bgColor: { argb: 'E2EEDA'},};
      cabecera_estado_banda.font =  {... cabecera_codigo.font};
      cabecera_estado_banda.alignment = { ...cabecera_codigo.alignment};
      cabecera_estado_banda.border={ ...titulo_info.border} 
      // TEXTO MINIMO
      // worksheet.mergeCells('F5');
      const cabecera_minimo_soles = worksheet.getCell('U5');
      cabecera_minimo_soles.value = "INCREMENTO BÁSICO"; 
      cabecera_minimo_soles.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'A9CD90'},
        bgColor: { argb: 'A9CD90'},};
      cabecera_minimo_soles.font =  {... cabecera_codigo.font};
      cabecera_minimo_soles.alignment = { ...cabecera_codigo.alignment};
      cabecera_minimo_soles.border={ ...titulo_info.border} 
      // TEXTO MEDIO
      // worksheet.mergeCells('F5');
      const cabecera_medio_soles = worksheet.getCell('V5');
      cabecera_medio_soles.value = "OTROS FIJOS MES"; 
      cabecera_medio_soles.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'E2EEDA'},
        bgColor: { argb: 'E2EEDA'},};
      cabecera_medio_soles.font =  {... cabecera_codigo.font};
      cabecera_medio_soles.alignment = { ...cabecera_codigo.alignment};
      cabecera_medio_soles.border={ ...titulo_info.border}  

      // TEXTO MAXIMO
      // worksheet.mergeCells('F5');
      const cabecera_maximo_soles = worksheet.getCell('W5');
      cabecera_maximo_soles.value = "VARIABLE MES"; 
      cabecera_maximo_soles.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'E2EEDA'},
        bgColor: { argb: 'E2EEDA'},};
      cabecera_maximo_soles.font =  {... cabecera_codigo.font};
      cabecera_maximo_soles.alignment = { ...cabecera_codigo.alignment};
      cabecera_maximo_soles.border={ ...titulo_info.border}  
      // TEXTO PER BANDA %
      // worksheet.mergeCells('F5');
      const cabecera_per_banda = worksheet.getCell('X5');
      cabecera_per_banda.value = "PASI"; 
      cabecera_per_banda.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'E2EEDA'},
        bgColor: { argb: 'E2EEDA'},};
      cabecera_per_banda.font =  {... cabecera_codigo.font};
      cabecera_per_banda.alignment = { ...cabecera_codigo.alignment};
      cabecera_per_banda.border={ ...titulo_info.border} 
    
    // TEXTO FUERA DE BANDA NEGATIVO
    //worksheet.mergeCells('X5:AC5');
    const cabecera_fuera_banda_negativo = worksheet.getCell('Y5');
    cabecera_fuera_banda_negativo.value = "INCREMENTO PASI"; 
    cabecera_fuera_banda_negativo.fill={type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'A9CD90'},
          bgColor: { argb: 'A9CD90'},
    };
    cabecera_fuera_banda_negativo.font =  {... cabecera_codigo.font};
    cabecera_fuera_banda_negativo.alignment = { ...cabecera_codigo.alignment};
    cabecera_fuera_banda_negativo.border={ ...titulo_info.border} 


      // TEXTO OTROS NO REMUNERATIVOS 2
      // worksheet.mergeCells('F5');
      const cabecera_OtrosNoRemunerativos2 = worksheet.getCell('Z5');
      cabecera_OtrosNoRemunerativos2.value = "OTROS NO REMUNER."; 
      cabecera_OtrosNoRemunerativos2.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'E2EEDA'},
        bgColor: { argb: 'E2EEDA'},};
      cabecera_OtrosNoRemunerativos2.font =  {... cabecera_codigo.font};
      cabecera_OtrosNoRemunerativos2.alignment = { ...cabecera_codigo.alignment};
      cabecera_OtrosNoRemunerativos2.border={ ...titulo_info.border} 
      

            // TEXTO OTROS NO REMUNERATIVOS 2
      // worksheet.mergeCells('F5');
      const cabecera_IngresoMes2 = worksheet.getCell('AA5');
      cabecera_IngresoMes2.value = "INGRESO MES"; 
      cabecera_IngresoMes2.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'E2EEDA'},
        bgColor: { argb: 'E2EEDA'},};
        cabecera_IngresoMes2.font =  {... cabecera_codigo.font};
        cabecera_IngresoMes2.alignment = { ...cabecera_codigo.alignment};
        cabecera_IngresoMes2.border={ ...titulo_info.border} 

      // TEXTO BONO ANUAL 2
      // worksheet.mergeCells('F5');
      const cabecera_BonoAnual2 = worksheet.getCell('AB5');
      cabecera_BonoAnual2.value = "BONO ANUAL"; 
      cabecera_BonoAnual2.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'E2EEDA'},
        bgColor: { argb: 'E2EEDA'},};
        cabecera_BonoAnual2.font =  {... cabecera_codigo.font};
        cabecera_BonoAnual2.alignment = { ...cabecera_codigo.alignment};
        cabecera_BonoAnual2.border={ ...titulo_info.border} 


      // COSTO ANUAL 2
      // worksheet.mergeCells('F5');
      const cabecera_CostoAnual2 = worksheet.getCell('AC5');
      cabecera_CostoAnual2.value = "COSTO ANUAL"; 
      cabecera_CostoAnual2.fill={...cabecera_codigo.fill,fgColor: { argb: 'E2EEDA'},bgColor: { argb: 'E2EEDA'},};
      cabecera_CostoAnual2.font =  {... cabecera_codigo.font};
      cabecera_CostoAnual2.alignment = { ...cabecera_codigo.alignment};
      cabecera_CostoAnual2.border={ ...titulo_info.border} 


       // TEXTO ESPACIO4
      // worksheet.mergeCells('F5');
      const cabecera_Espacio4 = worksheet.getCell('AD5');
      cabecera_Espacio4.value = ""; 
      cabecera_Espacio4.fill={...cabecera_codigo.fill,fgColor: { argb: 'FFFFFF'},bgColor: { argb: 'FFFFFF'},};
      
      cabecera_Espacio4.font =  {... cabecera_codigo.font};
      cabecera_Espacio4.alignment = { ...cabecera_codigo.alignment};
      cabecera_Espacio4.border={}  


      // VARIAC. COSTO ANUAL
      // worksheet.mergeCells('F5');
      worksheet.mergeCells('AE4:AE5');
      const cabecera_VarCostoAnual = worksheet.getCell('AE4');
      cabecera_VarCostoAnual.value = "VARIAC. COSTO ANUAL"; 
      cabecera_VarCostoAnual.fill={...cabecera_codigo.fill,fgColor: { argb: 'FFF2CB'},bgColor: { argb: 'FFF2CB'},};
      cabecera_VarCostoAnual.font =  {... cabecera_codigo.font};
      cabecera_VarCostoAnual.alignment = { ...cabecera_codigo.alignment};
      cabecera_VarCostoAnual.border={ ...titulo_info.border} 

   

   // LISTADO CABECERA
   const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, index) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '99CCFF'},
        bgColor: { argb: '99CCFF'},
      };
      cell.font = { name: 'Arial Narrow',family: 2,size:10, bold:true, color: { argb: '000000' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center'}
      cell.border={ ...titulo_info.border}
      // worksheet.getColumn(index).width = header[index - 1].length < 20 ? 20:header[index-1].length;
      worksheet.getColumn(index).width = headerExport[index - 1].ancho;
      
    });
 
    
    // const numFmtStr = '_("S/."* #,##0.00_);_("$"* (#,##0.00);_("S/."* 0.00??_);_(@_)';
    const numFmtStr = '_(#,##0.00_);_((#,##0.00);_(0.00_);_(@_)';
    const porcFmtStr='#,#0.00"%"';
    const texto_total="TOTAL";
    
    if (content != undefined) {


      let total_prevAnnualCost=0;
      let total_annualCost =0;
      let total_variationAnnualCost= 0;

      content.forEach((element:any) => {
        const eachRow: any[] = [];
        keysdata.forEach((key) => {
          eachRow.push(element[key]);
        });

        
        const contentRow = worksheet.addRow(eachRow);

          contentRow.eachCell((cell, index) => {
            cell.alignment = { vertical: 'middle', horizontal: headerExport[index - 1].horizontal};
            

            if(headerExport[index - 1].codigo==='variationMontlyIncome' || headerExport[index - 1].codigo==='variationAnnualCost' ){
                cell.numFmt=porcFmtStr; 
            }else{
                cell.numFmt=headerExport[index - 1].formato == 'money'?numFmtStr:''; 
            }

            cell.font = {name: 'Arial Narrow', family: 2, size:8};
            cell.border={ ...titulo_info.border}
            let e = eachRow[index - 1];
            if(headerExport[index - 1].codigo == 'lights') {
              cell.value='',
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: e == 0.1 ? 'ff7171' : 
                          e == 0.2 ? 'ffdc6d' : 
                          e == 0.3 ? '92d050' : 
                          e == 0.4 ? '00b0f0' : 
                          e == 0.5 ? 'ffffff' : 
                          'ffffff',
                         }
              };
              cell.font = { 
                ...cell.font,
                bold:true
              };
              cell.border={ ...titulo_info.border}
            }

          });

          // SUMA TOTALES

        total_prevAnnualCost += element.prevAnnualCost;
        total_annualCost+=element.annualCost;
        total_variationAnnualCost+=element.variationAnnualCost;
      });
      
      // TEXTO SUMA TOTAL
      let total_filas=5+content.length+3;

        
      // PARA CELDAS SUMA TOTALES
      let arreglo_totales:any[]=[];
       arreglo_totales=[
       {celda:'O',monto_total:total_prevAnnualCost},
       {celda:'AC',monto_total:total_annualCost},
       {celda:'AE',monto_total:total_variationAnnualCost},
      
      ],

        arreglo_totales.forEach((element)=>{
            const res_sueldo_basico = worksheet.getCell(element.celda+total_filas);
            res_sueldo_basico.value =element.monto_total; 
            res_sueldo_basico.numFmt=numFmtStr; 

            

            res_sueldo_basico.font = { name: 'Arial Narrow',family: 2,size:8, bold:true, color: { argb: '000000' } };
            res_sueldo_basico.alignment = { vertical: 'middle', horizontal: 'right'}; 
            res_sueldo_basico.border={ ...titulo_info.border}  
            if (element.celda==='O'){
                res_sueldo_basico.fill={type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'DEEAF6'},
                bgColor: { argb: 'DEEAF6'},
                };
            }else if (element.celda==='AB'){
                res_sueldo_basico.fill={type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'E2EEDA'},
                bgColor: { argb: 'E2EEDA'},
                };
            }else {
                res_sueldo_basico.fill={type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF2CB'},
                bgColor: { argb: 'FFF2CB'},
                };
                if(element.celda==='AE'){
                  res_sueldo_basico.numFmt=porcFmtStr; 
                }
                
            }

                
           
      });

      
    }
    worksheet.spliceRows(6,1);
    worksheet.addRow([]);


    documento.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {type: EXCEL_TYPE});
      fs.saveAs(blob, excelFileName + EXCEL_EXTENSION);
    })
  }
}

