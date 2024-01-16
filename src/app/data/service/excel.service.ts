import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import  * as fs  from 'file-saver';
import { ISalaryBandExport } from '../schema/salary-band';

const EXCEL_EXTENSION = '.xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTR-8';
@Injectable({
  providedIn: 'root'
})
export class ExportarService {

  constructor() { }

  public exportSalaryBandAsExcelFile(
    headerExport: ISalaryBandExport[],
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
    worksheet.mergeCells('A1:AS1');
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
    // TEXTO BANDA
    worksheet.mergeCells('T3:V3');
    const texto_banda = worksheet.getCell('T3');
    texto_banda.value = "BANDA .+ /- 60%"; 
    texto_banda.fill={type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0000'},
          bgColor: { argb: 'FF0000'},
        };
    texto_banda.font = { name: 'Arial Narrow',
        family: 2,
        size: 11,
        color: { argb: 'FFFFFF' },
        bold:true,
      };
    texto_banda.alignment = { vertical: 'middle', horizontal: 'center'};
    texto_banda.border={ ...titulo_info.border}
    // TEXTO DETALLE INGRESOS
    worksheet.mergeCells('H4:L4');
    const texto_detalle_ingreso = worksheet.getCell('H4');
    texto_detalle_ingreso.value = "DETALLE DE INGRESOS"; 
    texto_detalle_ingreso.fill={type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'DBDBDB'},
          bgColor: { argb: 'DBDBDB'},
    };
    texto_detalle_ingreso.font = { name: 'Arial Narrow',
        family: 2,
        size: 11,
        color: { argb: '000000' },
    };
    texto_detalle_ingreso.alignment = { vertical: 'middle', horizontal: 'center'};
    texto_detalle_ingreso.border={ ...titulo_info.border}
    // TEXTO MERCADO
    worksheet.mergeCells('T4:V4');
    const texto_mercado = worksheet.getCell('T4');
    texto_mercado.value = "Mercado"; 
    texto_mercado.fill={type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ACB9CA'},
          bgColor: { argb: 'ACB9CA'},
    };
    texto_mercado.font = { name: 'Arial Narrow',
        family: 2,
        size: 11,
        color: { argb: '000000' },
    };
    texto_mercado.alignment = { vertical: 'middle', horizontal: 'center'};
    texto_mercado.border={ ...titulo_info.border}
    // TEXTO BANDA DEL PUESTO
    worksheet.mergeCells('X4:AS4');
    const texto_banda_puesto = worksheet.getCell('X4');
    texto_banda_puesto.value = "Banda del Puesto"; 
    texto_banda_puesto.fill={type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '99CCFF'},
          bgColor: { argb: '99CCFF'},
    };
    texto_banda_puesto.font = { name: 'Arial Narrow',
        family: 2,
        size: 11,
        color: { argb: '000000' },
    };
    texto_banda_puesto.alignment = { vertical: 'middle', horizontal: 'center'};
    texto_banda_puesto.border={ ...titulo_info.border}
    // CABECERA MANUAL
    const row = worksheet.getRow(5);
      row.height=56;
      // TEXTO CODIGO
      // worksheet.mergeCells('A5');
      const cabecera_codigo = worksheet.getCell('A5');
      cabecera_codigo.value = "Codigo"; 
      cabecera_codigo.fill={type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '99CCFF'},
            bgColor: { argb: '99CCFF'},
      };
      cabecera_codigo.font =  { name: 'Arial Narrow',family: 2,size:10, bold:true, color: { argb: '000000' } };
      cabecera_codigo.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true};
      cabecera_codigo.border={ ...titulo_info.border}
      // TEXTO NOMBRE
      // worksheet.mergeCells('B5');
      const cabecera_nombre = worksheet.getCell('B5');
      cabecera_nombre.value = "Nombre"; 
      cabecera_nombre.fill={...cabecera_codigo.fill
      };
      cabecera_nombre.font =  {... cabecera_codigo.font};
      cabecera_nombre.alignment = { ...cabecera_codigo.alignment};
      cabecera_nombre.border={ ...titulo_info.border}
      // TEXTO CARGO
      // worksheet.mergeCells('B5');
      const cabecera_cargo = worksheet.getCell('C5');
      cabecera_cargo.value = "Cargo"; 
      cabecera_cargo.fill={...cabecera_codigo.fill
      };
      cabecera_cargo.font =  {... cabecera_codigo.font};
      cabecera_cargo.alignment = { ...cabecera_codigo.alignment};
      cabecera_cargo.border={ ...titulo_info.border}
      // TEXTO AREA
      worksheet.mergeCells('D5');
      const cabecera_area = worksheet.getCell('D5');
      cabecera_area.value = "Área"; 
      cabecera_area.fill={...cabecera_codigo.fill
      };
      cabecera_area.font =  {... cabecera_codigo.font};
      cabecera_area.alignment = { ...cabecera_codigo.alignment};
      cabecera_area.border={ ...titulo_info.border}
      // TEXTO CATEGORIA
      worksheet.mergeCells('E5');
      const cabecera_categoria = worksheet.getCell('E5');
      cabecera_categoria.value = "Categoría"; 
      cabecera_categoria.fill={...cabecera_codigo.fill
      };
      cabecera_categoria.font =  {... cabecera_codigo.font};
      cabecera_categoria.alignment = { ...cabecera_codigo.alignment};
      cabecera_categoria.border={ ...titulo_info.border}
      // TEXTO FECHA INGRESO
      // worksheet.mergeCells('F5');
      const cabecera_fecha_ingreso = worksheet.getCell('F5');
      cabecera_fecha_ingreso.value = "Fecha Ingreso"; 
      cabecera_fecha_ingreso.fill={...cabecera_codigo.fill
      };
      cabecera_fecha_ingreso.font =  {... cabecera_codigo.font};
      cabecera_fecha_ingreso.alignment = { ...cabecera_codigo.alignment};
      cabecera_fecha_ingreso.border={ ...titulo_info.border}
       // TEXTO AÑOS DE SERVICIO
      // worksheet.mergeCells('F5');
      const cabecera_anios_servicio = worksheet.getCell('G5');
      cabecera_anios_servicio.value = "Años de Servicio"; 
      cabecera_anios_servicio.fill={...cabecera_codigo.fill
      };
      cabecera_anios_servicio.font =  {... cabecera_codigo.font};
      cabecera_anios_servicio.alignment = { ...cabecera_codigo.alignment};
      cabecera_anios_servicio.border={ ...titulo_info.border}
      // TEXTO AÑOS DE SERVICIO
      // worksheet.mergeCells('F5');
      const cabecera_sueldo_basico = worksheet.getCell('H5');
      cabecera_sueldo_basico.value = "Sueldo Básico"; 
      cabecera_sueldo_basico.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'DBDBDB'},
        bgColor: { argb: 'DBDBDB'},
      };
      cabecera_sueldo_basico.font =  {... cabecera_codigo.font};
      cabecera_sueldo_basico.alignment = { ...cabecera_codigo.alignment};
      cabecera_sueldo_basico.border={ ...titulo_info.border}
      // TEXTO PASI
      // worksheet.mergeCells('F5');
      const cabecera_pasi = worksheet.getCell('I5');
      cabecera_pasi.value = "PASI"; 
      cabecera_pasi.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'DBDBDB'},
        bgColor: { argb: 'DBDBDB'},
      };
      cabecera_pasi.font =  {... cabecera_codigo.font};
      cabecera_pasi.alignment = { ...cabecera_codigo.alignment};
      cabecera_pasi.border={ ...titulo_info.border}
      // TEXTO PROMEDIO INGRESOS VARIABLES
      // worksheet.mergeCells('F5');
      const cabecera_promedio_ingreso_variable = worksheet.getCell('J5');
      cabecera_promedio_ingreso_variable.value = "PROMEDIO DE INGRESOS VARIABLES"; 
      cabecera_promedio_ingreso_variable.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'DBDBDB'},
        bgColor: { argb: 'DBDBDB'},
      };
      cabecera_promedio_ingreso_variable.font =  {... cabecera_codigo.font};
      cabecera_promedio_ingreso_variable.alignment = { ...cabecera_codigo.alignment};
      cabecera_promedio_ingreso_variable.border={ ...titulo_info.border}
      // TEXTO PROMEDIO INGRESOS VARIABLES
      // worksheet.mergeCells('F5');
      const cabecera_ingresos_no_remunerativos = worksheet.getCell('K5');
      cabecera_ingresos_no_remunerativos.value = "OTROS INGRESOS NO REMUNERATIVOS"; 
      cabecera_ingresos_no_remunerativos.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'DBDBDB'},
        bgColor: { argb: 'DBDBDB'},
      };
      cabecera_ingresos_no_remunerativos.font =  {... cabecera_codigo.font};
      cabecera_ingresos_no_remunerativos.alignment = { ...cabecera_codigo.alignment};
      cabecera_ingresos_no_remunerativos.border={ ...titulo_info.border}
      // TEXTO TOTAL SUELDO
      // worksheet.mergeCells('F5');
      const cabecera_total_sueldo = worksheet.getCell('L5');
      cabecera_total_sueldo.value = "TOTAL SUELDO"; 
      cabecera_total_sueldo.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'DBDBDB'},
        bgColor: { argb: 'DBDBDB'},
      };
      cabecera_total_sueldo.font =  {... cabecera_codigo.font};
      cabecera_total_sueldo.alignment = { ...cabecera_codigo.alignment};
      cabecera_total_sueldo.border={ ...titulo_info.border}
      // TEXTO INCREMENTO BASICO
      // worksheet.mergeCells('F5');
      const cabecera_incremento_basico = worksheet.getCell('M5');
      cabecera_incremento_basico.value = "Incremento Básico"; 
      cabecera_incremento_basico.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'FFD966'},
        bgColor: { argb: 'FFD966'},
      };
      cabecera_incremento_basico.font =  {... cabecera_codigo.font};
      cabecera_incremento_basico.alignment = { ...cabecera_codigo.alignment};
      cabecera_incremento_basico.border={ ...titulo_info.border}
      // TEXTO INCREMENTO PASI
      // worksheet.mergeCells('F5');
      const cabecera_incremento_pasi = worksheet.getCell('N5');
      cabecera_incremento_pasi.value = "Incremento de PASI"; 
      cabecera_incremento_pasi.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'FFD966'},
        bgColor: { argb: 'FFD966'},};
      cabecera_incremento_pasi.font =  {... cabecera_codigo.font};
      cabecera_incremento_pasi.alignment = { ...cabecera_codigo.alignment};
      cabecera_incremento_pasi.border={ ...titulo_info.border}
      // TEXTO INCREMENTO INGRESO NO REMUNERATIVO
      // worksheet.mergeCells('F5');
      const cabecera_incremento_ing_no_remun = worksheet.getCell('O5');
      cabecera_incremento_ing_no_remun.value = "Incremento de Ing. No Remun."; 
      cabecera_incremento_ing_no_remun.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'FFD966'},
        bgColor: { argb: 'FFD966'},};
      cabecera_incremento_ing_no_remun.font =  {... cabecera_codigo.font};
      cabecera_incremento_ing_no_remun.alignment = { ...cabecera_codigo.alignment};
      cabecera_incremento_ing_no_remun.border={ ...titulo_info.border}
      // TEXTO SUELDO PARA BANDA
      // worksheet.mergeCells('F5');
      const cabecera_sueldo_banda = worksheet.getCell('P5');
      cabecera_sueldo_banda.value = "SUELDO PARA BANDA"; 
      cabecera_sueldo_banda.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'FFD966'},
        bgColor: { argb: 'FFD966'},};
      cabecera_sueldo_banda.font =  {... cabecera_codigo.font};
      cabecera_sueldo_banda.alignment = { ...cabecera_codigo.alignment};
      cabecera_sueldo_banda.border={ ...titulo_info.border}  
      // TEXTO INGRESO NO REMUNERATIVO
      // worksheet.mergeCells('F5');
      const cabecera_total_nuevos_ingresos = worksheet.getCell('Q5');
      cabecera_total_nuevos_ingresos.value = "Total Nuevos Ingresos"; 
      cabecera_total_nuevos_ingresos.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'FFD966'},
        bgColor: { argb: 'FFD966'},};
      cabecera_total_nuevos_ingresos.font =  {... cabecera_codigo.font};
      cabecera_total_nuevos_ingresos.alignment = { ...cabecera_codigo.alignment};
      cabecera_total_nuevos_ingresos.border={ ...titulo_info.border}    
      // TEXTO SEMAFORO DE ALERTA
      // worksheet.mergeCells('F5');
      const cabecera_semaforo_alerta = worksheet.getCell('R5');
      cabecera_semaforo_alerta.value = "SEMAFORO DE ALERTA"; 
      cabecera_semaforo_alerta.fill={...cabecera_codigo.fill};
      cabecera_semaforo_alerta.font =  {... cabecera_codigo.font};
      cabecera_semaforo_alerta.alignment = { ...cabecera_codigo.alignment};
      cabecera_semaforo_alerta.border={ ...titulo_info.border}  
      // TEXTO ESTADO BANDA
      // worksheet.mergeCells('F5');
      const cabecera_estado_banda = worksheet.getCell('S5');
      cabecera_estado_banda.value = "Estado en Banda"; 
      cabecera_estado_banda.fill={...cabecera_codigo.fill};
      cabecera_estado_banda.font =  {... cabecera_codigo.font};
      cabecera_estado_banda.alignment = { ...cabecera_codigo.alignment};
      cabecera_estado_banda.border={ ...titulo_info.border} 
      // TEXTO MINIMO
      // worksheet.mergeCells('F5');
      const cabecera_minimo_soles = worksheet.getCell('T5');
      cabecera_minimo_soles.value = "Mínimo S/"; 
      cabecera_minimo_soles.fill={...cabecera_codigo.fill,
        fgColor: { argb: '4472C4'},
        bgColor: { argb: '4472C4'},};
      cabecera_minimo_soles.font =  {... cabecera_codigo.font};
      cabecera_minimo_soles.alignment = { ...cabecera_codigo.alignment};
      cabecera_minimo_soles.border={ ...titulo_info.border} 
      // TEXTO MEDIO
      // worksheet.mergeCells('F5');
      const cabecera_medio_soles = worksheet.getCell('U5');
      cabecera_medio_soles.value = "Medio S/"; 
      cabecera_medio_soles.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'FFFFCC'},
        bgColor: { argb: 'FFFFCC'},};
      cabecera_medio_soles.font =  {... cabecera_codigo.font};
      cabecera_medio_soles.alignment = { ...cabecera_codigo.alignment};
      cabecera_medio_soles.border={ ...titulo_info.border}  
      // TEXTO MAXIMO
      // worksheet.mergeCells('F5');
      const cabecera_maximo_soles = worksheet.getCell('V5');
      cabecera_maximo_soles.value = "Máximo S/"; 
      cabecera_maximo_soles.fill={...cabecera_codigo.fill,
        fgColor: { argb: 'F8CBAD'},
        bgColor: { argb: 'F8CBAD'},};
      cabecera_maximo_soles.font =  {... cabecera_codigo.font};
      cabecera_maximo_soles.alignment = { ...cabecera_codigo.alignment};
      cabecera_maximo_soles.border={ ...titulo_info.border}  
      // TEXTO PER BANDA %
      // worksheet.mergeCells('F5');
      const cabecera_per_banda = worksheet.getCell('W5');
      cabecera_per_banda.value = "PER BANDA %"; 
      cabecera_per_banda.fill={...cabecera_codigo.fill};
      cabecera_per_banda.font =  {... cabecera_codigo.font};
      cabecera_per_banda.alignment = { ...cabecera_codigo.alignment};
      cabecera_per_banda.border={ ...titulo_info.border} 
    
    // TEXTO FUERA DE BANDA NEGATIVO
    worksheet.mergeCells('X5:AC5');
    const cabecera_fuera_banda_negativo = worksheet.getCell('X5');
    cabecera_fuera_banda_negativo.value = "(-) Fuera de la Banda"; 
    cabecera_fuera_banda_negativo.fill={type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '99CCFF'},
          bgColor: { argb: '99CCFF'},
    };
    cabecera_fuera_banda_negativo.font =  { name: 'Arial Narrow',family: 2,size:10, bold:true, color: { argb: '000000' } };
    cabecera_fuera_banda_negativo.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true};
    cabecera_fuera_banda_negativo.border={ ...titulo_info.border} 
    // TEXTO MINIMO
    worksheet.mergeCells('AD5:AF5');
    const cabecera_minimo = worksheet.getCell('AD5');
    cabecera_minimo.value = "Min"; 
    cabecera_minimo.fill={type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '99CCFF'},
          bgColor: { argb: '99CCFF'},
    };
    cabecera_minimo.font =  { name: 'Arial Narrow',family: 2,size:10, bold:true, color: { argb: '000000' } };
    cabecera_minimo.alignment = { vertical: 'middle', horizontal: 'center'};
    cabecera_minimo.border={ ...titulo_info.border}
    // TEXTO MEDIO
    worksheet.mergeCells('AG5:AJ5');
    const cabecera_medio = worksheet.getCell('AG5');
    cabecera_medio.value = "Medio"; 
    cabecera_medio.fill={type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '99CCFF'},
          bgColor: { argb: '99CCFF'},
    };
    cabecera_medio.font =  { name: 'Arial Narrow',family: 2,size:10, bold:true, color: { argb: '000000' } };
    cabecera_medio.alignment = { vertical: 'middle', horizontal: 'center'};
    cabecera_medio.border={ ...titulo_info.border}
    // TEXTO MAXIMO
    worksheet.mergeCells('AK5:AM5');
    const cabecera_maximo = worksheet.getCell('AK5');
    cabecera_maximo.value = "Máx"; 
    cabecera_maximo.fill={type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '99CCFF'},
          bgColor: { argb: '99CCFF'},
    };
    cabecera_maximo.font =  { name: 'Arial Narrow',family: 2,size:10, bold:true, color: { argb: '000000' } };
    cabecera_maximo.alignment = { vertical: 'middle', horizontal: 'center'};
    cabecera_maximo.border={ ...titulo_info.border}
    // TEXTO FUERA DE BANDA POSITIVO
    worksheet.mergeCells('AN5:AS5');
    const cabecera_fuera_banda_positivo = worksheet.getCell('AN5');
    cabecera_fuera_banda_positivo.value = "(+) Fuera de la Banda"; 
    cabecera_fuera_banda_positivo.fill={type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '99CCFF'},
          bgColor: { argb: '99CCFF'},
    };
    cabecera_fuera_banda_positivo.font =  { name: 'Arial Narrow',family: 2,size:10, bold:true, color: { argb: '000000' } };
    cabecera_fuera_banda_positivo.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true};
    cabecera_fuera_banda_positivo.border={ ...titulo_info.border}
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
    
    // top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" }


    // Cabecera Listado
    // const headerRow=worksheet.getRow(5);
    // headerRow.values=header;
    // headerRow.fill={
    //       type: 'pattern',
    //       pattern: 'solid',
    //       fgColor: { argb: '99CCFF'},
    //       bgColor: { argb: '99CCFF'},
    // };
    // headerRow.font = { name: 'Arial Narrow',family: 2,size:10, bold:true, color: { argb: '000000' } };
    // headerRow.alignment = { vertical: 'middle', horizontal: 'center'};

    // const numFmtStr = '_("S/."* #,##0.00_);_("$"* (#,##0.00);_("S/."* 0.00??_);_(@_)';
    const numFmtStr = '_(#,##0.00_);_((#,##0.00);_(0.00_);_(@_)';
    const texto_total="TOTAL";
    
    if (content != undefined) {
      let total_sueldo_basico=0;
      let total_pasivo=0;
      let total_promedio_ingreso=0;
      let total_otros_ingresos_no_remunerativos=0;
      let total_sueldo=0;
      let total_imcremento_basico=0;
      let total_imcremento_PASI=0;
      let total_incremento_ingreso_no_remunerativos=0;
      let total_banda=0;
      let total_nuevos_ingresos=0;
      let total_minimo=0;
      let total_medio=0;
      let total_maximo=0;

      content.forEach((element:any) => {
        const eachRow: any[] = [];
        keysdata.forEach((key) => {
          eachRow.push(element[key]);
        });

        
        const contentRow = worksheet.addRow(eachRow);

          contentRow.eachCell((cell, index) => {
            cell.alignment = { vertical: 'middle', horizontal: headerExport[index - 1].horizontal};
            
            cell.numFmt=headerExport[index - 1].formato == 'money'?numFmtStr:''; 
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

            // Celdas morados
            if(headerExport[index - 1].description == 'Banda1' ||
               headerExport[index - 1].description == 'Banda2' ||
               headerExport[index - 1].description == 'Banda3' ||
               headerExport[index - 1].description == 'Banda4' ||
               headerExport[index - 1].description == 'Banda5' ||
               headerExport[index - 1].description == 'Banda6' || 
               headerExport[index - 1].description == 'Banda17' || 
               headerExport[index - 1].description == 'Banda18' || 
               headerExport[index - 1].description == 'Banda19' || 
               headerExport[index - 1].description == 'Banda20' || 
               headerExport[index - 1].description == 'Banda21' || 
               headerExport[index - 1].description == 'Banda22' ){
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: e ='ccccff',}
                };
                cell.border={ ...titulo_info.border}  
            }

            // Celdas celestes
            if(headerExport[index - 1].description == 'Banda7' ||
               headerExport[index - 1].description == 'Banda8' ||
               headerExport[index - 1].description == 'Banda9' ||
               headerExport[index - 1].description == 'Banda10' ||
               headerExport[index - 1].description == 'Banda11' ||
               headerExport[index - 1].description == 'Banda12' || 
               headerExport[index - 1].description == 'Banda13' || 
               headerExport[index - 1].description == 'Banda14' || 
               headerExport[index - 1].description == 'Banda15' || 
               headerExport[index - 1].description == 'Banda16' ){
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: e ='99ccff',}
                };
                cell.border={ ...titulo_info.border}  
            }

          });

          // SUMA TOTALES
          total_sueldo_basico=total_sueldo_basico+element.basicMonth;
          total_pasivo=total_pasivo+element.passive;
          total_promedio_ingreso=total_promedio_ingreso+element.averageEarnableIncome;
          total_otros_ingresos_no_remunerativos=total_otros_ingresos_no_remunerativos+element.otherUnpaid;
          total_sueldo=total_sueldo+element.totalSalary;
          total_imcremento_basico=total_imcremento_basico+element.increase;
          total_imcremento_PASI=total_imcremento_PASI+element.increasePassive;
          total_incremento_ingreso_no_remunerativos=total_incremento_ingreso_no_remunerativos+element.increaseUnpaid;
          total_banda=total_banda+element.salaryBandAmount;
          total_nuevos_ingresos=total_nuevos_ingresos+element.totalNewIncome;
          total_minimo=total_minimo+element.minimunPoint;
          total_medio=total_medio+element.middlePoint;
          total_maximo=total_maximo+element.maximunPoint;
      });
      
      // TEXTO SUMA TOTAL
      let total_filas=5+content.length+2;
      const texto_suma_total = worksheet.getCell('G'+total_filas);
      texto_suma_total.value = "TOTAL"; 
      texto_suma_total.fill={type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ffffff'},
            bgColor: { argb: 'ffffff'},
          };
        texto_suma_total.font = { name: 'Arial Narrow',family: 2,size:12, bold:true, color: { argb: '000000' } };
        texto_suma_total.alignment = { vertical: 'middle', horizontal: 'right'};  
        texto_suma_total.border={ ...titulo_info.border}  
      // PARA CELDAS SUMA TOTALES
      let arreglo_totales:any[]=[];
       arreglo_totales=[
       {celda:'H',monto_total:total_sueldo_basico},
       {celda:'I',monto_total:total_pasivo},
       {celda:'J',monto_total:total_promedio_ingreso},
       {celda:'K',monto_total:total_otros_ingresos_no_remunerativos},
       {celda:'L',monto_total:total_sueldo},
       {celda:'M',monto_total:total_imcremento_basico},
       {celda:'N',monto_total:total_imcremento_PASI},
       {celda:'O',monto_total:total_incremento_ingreso_no_remunerativos},
       {celda:'P',monto_total:total_banda},
       {celda:'Q',monto_total:total_nuevos_ingresos},
       {celda:'T',monto_total:total_minimo},
       {celda:'U',monto_total:total_medio},
       {celda:'V',monto_total:total_maximo},
      
      ],

      // ['H','I','J','K','L','M','N','O','P','Q'].forEach((columnkey)=>{
        arreglo_totales.forEach((element)=>{
        const res_sueldo_basico = worksheet.getCell(element.celda+total_filas);
        res_sueldo_basico.value =element.monto_total; 
        res_sueldo_basico.numFmt=numFmtStr; 
        res_sueldo_basico.fill={type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'e8f3c3'},
              bgColor: { argb: 'e8f3c3'},
            };
            res_sueldo_basico.font = { name: 'Arial Narrow',family: 2,size:8, bold:true, color: { argb: '000000' } };
            res_sueldo_basico.alignment = { vertical: 'middle', horizontal: 'right'}; 
            res_sueldo_basico.border={ ...titulo_info.border}  
      });

     

        // const res_sueldo_basico = worksheet.getCell('H'+total_filas);
        // res_sueldo_basico.value =total_sueldo_basico; 
        // res_sueldo_basico.numFmt=numFmtStr; 
        // res_sueldo_basico.fill={type: 'pattern',
        //       pattern: 'solid',
        //       fgColor: { argb: 'ffffff'},
        //       bgColor: { argb: 'ffffff'},
        //     };
        //     res_sueldo_basico.font = { name: 'Arial Narrow',family: 2,size:8, bold:true, color: { argb: '000000' } };
        //     res_sueldo_basico.alignment = { vertical: 'middle', horizontal: 'right'};    
      
    }
    worksheet.spliceRows(6,1);
    worksheet.addRow([]);


    documento.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {type: EXCEL_TYPE});
      fs.saveAs(blob, excelFileName + EXCEL_EXTENSION);
    })
  }
}


// export class ExportarService {

//   constructor() { }

//   public exportAsExcelFile(
//     headerExport: IFieldsExport[],
//     excelFileName: string,
//     sheetName: string,
//     data?: any[]
//   )
//   {
//     const header:any[] = [];
//     const keysdata: any[] = [];

//     headerExport.forEach(element => {
//       header.push(element.description),
//       keysdata.push(element.codigo)
//     });

//     const content = data;

//     const documento = new Workbook();
//     documento.created = new Date();
//     documento.modified = new Date();

//     const worksheet = documento.addWorksheet(sheetName);

//     const headerRow = worksheet.addRow(header);

//     headerRow.eachCell((cell, index) => {
//       cell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: '005ca8'},
//         bgColor: { argb: '005ca8'},
//       };
//       cell.font = { size:12, bold:true, color: { argb: 'ffffff' } };
//       cell.alignment = { vertical: 'middle', horizontal: 'center'}

//       // worksheet.getColumn(index).width = header[index - 1].length < 20 ? 20:header[index-1].length;
//       worksheet.getColumn(index).width = headerExport[index - 1].ancho;
//     });


//     if (content != undefined) {
//       content.forEach((element:any) => {
//         const eachRow: any[] = [];
//         keysdata.forEach((key) => {
//           eachRow.push(element[key]);
//         });

//         if(element.isDeleted === 'Y'){
//           const deleteRow = worksheet.addRow(eachRow);
//           deleteRow.eachCell((cell) => {
//             cell.font = {name: 'Calibri', family: 4, size:20, bold:false, strike:true};
//           });
//         }else{
//           const contentRow = worksheet.addRow(eachRow);
//           contentRow.eachCell((cell, index) => {
//             cell.alignment = { vertical: 'middle', horizontal: headerExport[index - 1].horizontal};

//             let e = eachRow[index - 1];
//             if(headerExport[index - 1].description == 'Estado') {
//               cell.fill = {
//                 type: 'pattern',
//                 pattern: 'solid',
//                 fgColor: { argb: e == 'Activo' ? 'c8e6c9' : 'ffcdd2' }
//               };
//               cell.font = { color: { argb: e == 'Activo' ? '256029' : 'c63737' } };
//             }

//           });
//         }

//       });
//     }

//     worksheet.addRow([]);


//     documento.xlsx.writeBuffer().then((data: ArrayBuffer) => {
//       const blob = new Blob([data], {type: EXCEL_TYPE});
//       fs.saveAs(blob, excelFileName + EXCEL_EXTENSION);
//     })
//   }
// }