import { Injectable } from '@angular/core';
import { IBudgetResumeExport } from '@app/data/schema/salaryband/BudgetResumeExport';

import { Workbook } from 'exceljs';
import  * as fs  from 'file-saver';


const EXCEL_EXTENSION = '.xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTR-8';
@Injectable({
  providedIn: 'root'
})
export class SBBudgetResumeExportService {

  constructor() { }

  public export(
    headerExport: IBudgetResumeExport[],
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
    worksheet.mergeCells('A1:I1');
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
       //worksheet.mergeCells('A4:A5');
      const cabecera_codigo = worksheet.getCell('A5');
      cabecera_codigo.value = "AREA"; 
      cabecera_codigo.fill={type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '8CACDA'},
            bgColor: { argb: '8CACDA'},
      };
      cabecera_codigo.font =  { name: 'Calibri',family: 2,size:7, bold:true, color: { argb: '000000' } };
      cabecera_codigo.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true};
      cabecera_codigo.border={ ...titulo_info.border}

      // TEXTO NOMBRE
      //worksheet.mergeCells('B4:B5');
      const cabecera_nombre = worksheet.getCell('B5');
      cabecera_nombre.value = "EJECUTADO " + (periodo -3); 
      cabecera_nombre.fill={...cabecera_codigo.fill
      };
      cabecera_nombre.font =  {... cabecera_codigo.font};
      cabecera_nombre.alignment = { ...cabecera_codigo.alignment};
      cabecera_nombre.border={ ...titulo_info.border}

      // TEXTO CARGO
      //worksheet.mergeCells('C4:C5');
      const cabecera_cargo = worksheet.getCell('C5');
      cabecera_cargo.value = "EJECUTADO " + (periodo -2); 
      cabecera_cargo.fill={...cabecera_codigo.fill
      };
      cabecera_cargo.font =  {... cabecera_codigo.font};
      cabecera_cargo.alignment = { ...cabecera_codigo.alignment};
      cabecera_cargo.border={ ...titulo_info.border}

      // TEXTO AREA
      //worksheet.mergeCells('D4:D5');
      const cabecera_area = worksheet.getCell('D5');
      cabecera_area.value = "EJECUTADO " + (periodo -1); 
      cabecera_area.fill={...cabecera_codigo.fill
      };
      cabecera_area.font =  {... cabecera_codigo.font};
      cabecera_area.alignment = { ...cabecera_codigo.alignment};
      cabecera_area.border={ ...titulo_info.border}

      // TEXTO CONDICIÓN
      //worksheet.mergeCells('E4:E5');
      const cabecera_categoria = worksheet.getCell('E5');
      cabecera_categoria.value = "EJECUTADO " + (periodo ); 
      cabecera_categoria.fill={...cabecera_codigo.fill
      };
      cabecera_categoria.font =  {... cabecera_codigo.font};
      cabecera_categoria.alignment = { ...cabecera_codigo.alignment};
      cabecera_categoria.border={ ...titulo_info.border}

      // FECHA DE INGRESO
      //worksheet.mergeCells('F4:F5');
      const cabecera_fecha_ingreso = worksheet.getCell('F5');
      cabecera_fecha_ingreso.value = "PRESUPUESTO " +  (periodo-1); 
      cabecera_fecha_ingreso.fill={...cabecera_codigo.fill
      };
      cabecera_fecha_ingreso.font =  {... cabecera_codigo.font};
      cabecera_fecha_ingreso.alignment = { ...cabecera_codigo.alignment};
      cabecera_fecha_ingreso.border={ ...titulo_info.border}

        // FECHA DE INGRESO
      //worksheet.mergeCells('F4:F5');
      const cabecera_presu_actual = worksheet.getCell('G5');
      cabecera_presu_actual.value = "PRESUPUESTO " +  (periodo); 
      cabecera_presu_actual.fill={...cabecera_codigo.fill      };
      cabecera_presu_actual.font =  {... cabecera_codigo.font};
      cabecera_presu_actual.alignment = { ...cabecera_codigo.alignment};
      cabecera_presu_actual.border={ ...titulo_info.border}
//VAR P2023 vs E2022 %

const cabecera_presu_vs_eje = worksheet.getCell('H5');
      cabecera_presu_vs_eje.value = "VAR P" + periodo +" vs E"+ (periodo-1)+" %"; 
      cabecera_presu_vs_eje.fill={...cabecera_codigo.fill      };
      cabecera_presu_vs_eje.font =  {... cabecera_codigo.font};
      cabecera_presu_vs_eje.alignment = { ...cabecera_codigo.alignment};
      cabecera_presu_vs_eje.border={ ...titulo_info.border}

      const porc_presu_vs_eje = worksheet.getCell('I5');
      porc_presu_vs_eje.value = "VAR P"+ periodo+" vs E" +(periodo-1)+" S/."; 
      porc_presu_vs_eje.fill={...cabecera_codigo.fill      };
      porc_presu_vs_eje.font =  {... cabecera_codigo.font};
      porc_presu_vs_eje.alignment = { ...cabecera_codigo.alignment};
      porc_presu_vs_eje.border={ ...titulo_info.border}



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
    const numFmtStr = '#,##0.00;-#,##0.00'; //'_(#,##0.00_);_((#,##0.00);_(0.00_);_(@_)';
    const porcFmtStr='#,#0.00"%"';
    
    
    if (content != undefined) {


      let total_1=0;
      let total_2 =0;
      let total_3= 0;
      let total_4= 0;
      let total_5= 0;
      let total_6= 0;
      let total_7= 0;
      let total_8= 0;

      content.forEach((element:any) => {

        
        const eachRow: any[] = [];
        keysdata.forEach((key) => {
          eachRow.push(element[key]);
        });

        
        const contentRow = worksheet.addRow(eachRow);

          contentRow.eachCell((cell, index) => {
            cell.alignment = { vertical: 'middle', horizontal: headerExport[index - 1].horizontal};
            

            

            if(headerExport[index - 1].codigo==='variationPorc'  ){
                cell.numFmt=porcFmtStr; 
            }else{
                cell.numFmt=headerExport[index - 1].formato == 'money'?numFmtStr:''; 
            }


            if (element.isGroup === true){
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor:{ argb:'d9d9d9'}
                  };
                //  cell.value=element.nameGroup;
            }

            //cell.numFmt=headerExport[index - 1].formato == 'money'?numFmtStr:''; 
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

            total_1 += element.previousExecAmount2;
            total_2 += element.previousExecAmount1;
            total_3 += element.previousExecAmount;
            total_4 += element.currentExecAmount;
            total_5 += element.previousAmount;
            total_6 += element.currentAmount;
            total_7 += element.variationPorc;
            total_8 += element.variationAmount;

      });
      
      // TEXTO SUMA TOTAL
      let total_filas=5+content.length+3;

          const texto_suma_total = worksheet.getCell('A'+(total_filas));
          texto_suma_total.value = "TOTAL"; 
          texto_suma_total.fill={type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '002060'},
                bgColor: { argb: '002060'},
              };
            texto_suma_total.font = { name: 'Arial Narrow',family: 2,size:12, bold:true, color: { argb: 'FFFFFF' } };
            texto_suma_total.alignment = { vertical: 'middle', horizontal: 'left'};  
            texto_suma_total.border={ ...titulo_info.border}  
        

        total_7 =  ((total_6 / total_3) - 1)*100



      // PARA CELDAS SUMA TOTALES
     let arreglo_totales:any[]=[];
      arreglo_totales=[
      {celda:'B',monto_total:total_1},
      {celda:'C',monto_total:total_2},
      {celda:'D',monto_total:total_3},
      {celda:'E',monto_total:total_4},
      {celda:'F',monto_total:total_5},
      {celda:'G',monto_total:total_6},
      {celda:'H',monto_total:total_7},
      {celda:'I',monto_total:total_8},

     
     ],

      // ['H','I','J','K','L','M','N','O','P','Q'].forEach((columnkey)=>{
       arreglo_totales.forEach((element)=>{
           const res_sueldo_basico = worksheet.getCell(element.celda+total_filas);
           res_sueldo_basico.value =element.monto_total; 
           res_sueldo_basico.numFmt=numFmtStr; 

           

           res_sueldo_basico.font = { name: 'Arial Narrow',family: 2,size:8, bold:true, color: { argb: 'FFFFFF' } };
           res_sueldo_basico.alignment = { vertical: 'middle', horizontal: 'right'}; 
           res_sueldo_basico.border={ ...titulo_info.border}  
           if (element.celda==='B' || element.celda==='C' || element.celda==='D'|| element.celda==='E'
           || element.celda==='F' || element.celda==='G' || element.celda==='I'
           ){
               res_sueldo_basico.fill={type: 'pattern',
               pattern: 'solid',
               fgColor: { argb: '002060'},
               bgColor: { argb: '002060'},
               };
           }else {
               res_sueldo_basico.fill={type: 'pattern',
               pattern: 'solid',
               fgColor: { argb: '002060'},
               bgColor: { argb: '002060'},
               };
               res_sueldo_basico.numFmt=porcFmtStr; 
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

