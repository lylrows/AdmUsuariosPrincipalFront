import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '@app/data/service/employee.service';
import { StaffRequestService } from '@app/data/service/staff-request.service';
import { ChartData, ChartType } from 'chart.js';
import * as _moment from "moment";
import { EChartsOption } from 'echarts';
import { BasicEchartLineModel } from '@app/data/schema/result';

@Component({
  selector: 'app-report-medical',
  templateUrl: './report-medical.component.html',
  styleUrls: ['./report-medical.component.scss']
})
export class ReportMedicalComponent implements OnInit {
  solicitudStatusData:any[];
  solicitudEtapasData:any[];

  _chartOptionStatus: EChartsOption;
  _chartOptionEtapas: EChartsOption;
 
  typerequest: any[] = [];
  listmedical: any[] = []
  ntype = new FormControl('');
  ddateinit = new FormControl('');
  ddateend = new FormControl('');

  netapa = new FormControl('');
  nstate = new FormControl('');
  screenWidth: number;
  nid_employee: number = 0;
  nid_position: number = 0;

  listReport: any[] = [
    {
      code: 1, name: 'Pendiente'
    },
    {
      code: 2, name: 'Aprobado'
    },
    {
      code: 3, name: 'Rechazado'
    },
    {
      code: 4, name: 'Observado'
    },
    {
      code: 8, name: 'Finalizado'
    }
  ]

  listEtapa: any[] = [
    {
      code: 1, name: 'Etapa 1: Evaluación'
    },
    {
      code: 5, name: 'Etapa 2: Registro VIVA'
    },
    {
      code: 6, name: 'Etapa 3: Evaluación VIVA'
    },
    {
      code: 7, name: 'Etapa 4: Recupero VIVA'
    }
  ]

  sharedChartOptions: any = {
    responsive: true,
    // maintainAspectRatio: false,
    legend: {
      display: false,
      position: 'bottom'
    }
  };

  dataReportStatus = [];

  pendientecount: number = 0;
  aprobadocount : number = 0;
  rechazadocount : number = 0;
  observadocount : number = 0;
  finalizadocount : number = 0;


  etapa1: number = 0;
  etapa2 : number = 0;
  etapa3 : number = 0;
  etapa4 : number = 0;

  public doughnutChartLabels: string[] = [ 'Pendiente', 'Aprobado', 'Rechazado', 'Observado','Finalizado' ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: []
  };


  public doughnutChartEtapasLabels: string[] = [ 'Etapa 1: Evaluación', 'Etapa 2: Registro VIVA', 'Etapa 3: Evaluación VIVA', 'Etapa 4: Recupero VIVA' ];
  public doughnutChartEtapasData: ChartData<'doughnut'> = {
    labels: this.doughnutChartEtapasLabels,
    datasets: []
  };
  public doughnutChartType: ChartType = 'doughnut';

  amount_charged: number = 0
  amount_generated: number = 0
  amount_loading: number = 0
  amount_perdido: number = 0

  documentDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginatordocument: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    "type",
    "sdni",
    "collabator",
    // "dregister",
    "typedm",
    "origindm",
    "dateinit",
    "dateend",
    "sareaname",
    
    "sdatedocument",
    "etapa",
    "state",
    "view"
  ];

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private _serviceEmployee: EmployeeService,
    private _serviceStaff: StaffRequestService,
    private staffRequestService: StaffRequestService,
  ) {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_employee = storage.nid_employee;
    this.nid_position = storage.nid_position;
  }

  ngOnInit(): void {
    this.loadinfo();
    this.loadtype();
    this.reportAmount()
    this.screenWidth = window.innerWidth;
  }
 

  reportAmount(): void {
    this.staffRequestService.reportAmount().subscribe(resp => {
      this.amount_charged = resp.data.amount_charged;
      this.amount_generated = resp.data.amount_generated;
      this.amount_loading = resp.data.amount_loading;
      this.amount_perdido = resp.data.amount_perdido;
    })
  }

  resetFilter(): void {
    this.ntype.setValue('');
    this.netapa.setValue('');
    this.nstate.setValue('');
    this.loadinfo();
  }

  loadtype(): void {
    this._serviceEmployee.ListGeneric(1004).subscribe(resp => {
      this.typerequest = resp;
    })
  }

  filter(): void {
    let employeeid = this.nid_employee;

    const payload = {
      nid_employee: employeeid,
      ntype: Number(this.ntype.value),
      ddateinit: this.ddateinit.value,
      ddateend: this.ddateend.value,
    }

    this._serviceStaff.getmedicallist(payload).subscribe(resp => {
      
      this.listmedical = resp.data;

      this.getReportStatus();
      this.getReportEtapa();
      const array = [];

      if ( this.netapa.value > 0 || this.nstate.value > 0 ) {

        if ( this.nstate.value > 0 && this.netapa.value === ''  ) {

          if ( this.nstate.value === 2 ) {

            const arrayetapa : any[] = [2,5,6,7,8]

            arrayetapa.map(e => {
  
              this.listmedical.map(v => {
  
                if ( v.nstate === e ) {
                  array.push(v);
                }
  
              })
  
            })

          } else {

            this.listmedical.map(e => {
  
              if ( e.nstate === this.nstate.value ) {
                array.push(e);
              }
  
            })

          }

        }

        if ( this.netapa.value > 0 && this.nstate.value === ''  ) {

          if ( this.netapa.value === 1 ) {
            
            const arrayetapa : any[] = [1,2,4]
  
            arrayetapa.map(e => {
  
              this.listmedical.map(v => {
  
                if ( v.nstate === e ) {
                  array.push(v);
                }
  
              })
  
            })
  
          } else {
  
            this.listmedical.map(e => {
  
              if ( e.nstate === this.netapa.value ) {
                array.push(e);
              }
  
            })
  
          }
        }

        if ( this.netapa.value > 0 && this.nstate.value  > 0 ) {

          const array1 : any[] = [];

          if ( this.nstate.value === 2 ) {

            const arrayetapa : any[] = [2,5,6,7,8]

            arrayetapa.map(e => {
  
              this.listmedical.map(v => {
  
                if ( v.nstate === e ) {
                  array1.push(v);
                }
  
              })
  
            })

          } else {

            this.listmedical.map(e => {
  
              if ( e.nstate === this.nstate.value ) {
                array1.push(e);
              }
  
            })

          }

          const array2: any[] = [];

          if ( this.netapa.value === 1 ) {
            
            const arrayetapa : any[] = [1,2,4]
            
            arrayetapa.map(e => {
  
              this.listmedical.map(v => {
  
                if ( v.nstate === e ) {
                  array2.push(v);
                }
  
              })
  
            })
  
          } else {
  
            this.listmedical.map(e => {
  
              if ( e.nstate === this.netapa.value ) {
                array2.push(e);
              }
  
            })
  
          }

          const array3: any[] = [];

          array1.map(o => {

            array2.map(t => {

              if ( t.nid_medical === o.nid_medical ) {
                array3.push(t);
              }

            })

          })
          
          array3.map(p => {
            array.push(p);
          })
        }

        this.documentDT = new MatTableDataSource(array);
        this.documentDT.paginator = this.paginatordocument;

      } else {
        this.documentDT = new MatTableDataSource(this.listmedical);
        this.documentDT.paginator = this.paginatordocument;
      }



    })
  }

  getReportStatus(): void {
    const payloadfilter = {
      ddateinit:  this.ddateinit.value,
      ddateend: this.ddateend.value,
    }

    this._serviceStaff.reportGraficStatus(payloadfilter).subscribe(re => {
      

      
      this.pendientecount = re.data.pendiente;
      this.aprobadocount = re.data.aprobado;
      this.rechazadocount = re.data.rechazado;
      this.observadocount = re.data.observado;
      this.finalizadocount = re.data.finalizado;

      this.doughnutChartData = {
        datasets: [
          { data: [this.pendientecount, this.aprobadocount, this.rechazadocount, this.observadocount, this.finalizadocount]  }
        ]
      }

      // this.solicitudStatusData=
      // [
      //   { value: this.pendientecount, name: 'Etapa 1' },
      //   { value: this.aprobadocount, name: 'Etapa 2'},
      //   { value: this.rechazadocount, name: 'Etapa 3' },
      //   { value: this.observadocount, name: 'Etapa 4' },
        
      // ];

      this.solicitudStatusData=[];
      if (re.data!== null){
        this.solicitudStatusData = re.data;
      }


      
      this.SolicitudStatusDonutEchart(this.solicitudStatusData);
    })
  }

  getReportEtapa(): void {
    const payloadfilter = {
      ddateinit:  this.ddateinit.value,
      ddateend: this.ddateend.value,
    }

    this._serviceStaff.reportGraficEtapa(payloadfilter).subscribe(re => {

      this.etapa1 = re.data.etapa1;
      this.etapa2 = re.data.etapa2;
      this.etapa3 = re.data.etapa3;
      this.etapa4 = re.data.etapa4;

      this.doughnutChartEtapasData = {
        datasets: [
          { data: [this.etapa1, this.etapa2, this.etapa3, this.etapa4]  }
        ]
      }
      this.solicitudEtapasData=
      [
        // { value: this.etapa1, name: 'Etapa 1: Evaluación', itemStyle: {color: '#ffa1b5'} },
        // { value: this.etapa2, name: 'Etapa 2: Registro VIVA', itemStyle: {color: '#86c7f3'} },
        // { value: this.etapa3, name: 'Etapa 3: Evaluación VIVA', itemStyle: {color: '#ffe29a'} },
        // { value: this.etapa4, name: 'Etapa 4: Recupero VIVA', itemStyle: {color: '#f1f2f4'} }
        
        { value: this.etapa1, name: 'Etapa 1: Evaluación', type: 'Etapa 1', },
        { value: this.etapa2, name: 'Etapa 2: Registro VIVA', type: 'Etapa 2', },
        { value: this.etapa3, name: 'Etapa 3: Evaluación VIVA', type: 'Etapa 3', },
        { value: this.etapa4, name: 'Etapa 4: Recupero VIVA',  type: 'Etapa 4', }
      ];
      
      this.SolicitudEtapasDonutEchart(this.solicitudStatusData);
    })
  }

  loadinfo(): void {

    this.ddateinit.setValue(new Date());
    this.ddateend.setValue(new Date());
    let employeeid = this.nid_employee;

    const payload = {
      nid_employee: employeeid,
      ntype: Number(this.ntype.value),
      ddateinit: this.ddateinit.value,
      ddateend: this.ddateend.value,
    }

    this._serviceStaff.getmedicallist(payload).subscribe(resp => {
      
      this.listmedical = resp.data;

      this.documentDT = new MatTableDataSource(this.listmedical);
      this.documentDT.paginator = this.paginatordocument;

    })

    this.getReportStatus();
    this.getReportEtapa();
  }

  export(): void {
    let employeeid = this.nid_employee;

    const payload = {
      nid_employee: employeeid,
      ntype: Number(this.ntype.value),
      ddateinit: this.ddateinit.value,
      ddateend: this.ddateend.value,
    }

    this._serviceStaff.getmedicallistPrint(payload).subscribe(
      (res: any) => {
        try {
          const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          const b64Data = res;

          const blob = this.b64toBlob(b64Data, contentType);
          
          const blobUrl = URL.createObjectURL(blob);

          const _afile = document.getElementById('afile') as HTMLAnchorElement;
          _afile.href = blobUrl;
          _afile.download = 'Listado.xlsx';
          _afile.click();
          window.URL.revokeObjectURL(blobUrl);

        } catch (e) {
        }
      }, (error: any) => {
        console.log('error', error)

        
      }
    );

  }

  b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  private SolicitudStatusDonutEchart(chartData:BasicEchartLineModel[]){
    if (this.screenWidth < 700){
      this._chartOptionStatus={
        tooltip: {
          trigger: 'item',
          confine: true,
          extraCssText: 'width:auto; white-space:pre-wrap;',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          
          data: this.solicitudStatusData.map(s => ({ name: s.name }))
        },
        color: [
          '#ffa1b5',
          '#86c7f3',
          '#ffe29a',
          '#f1f2f4',
          '#93d9d9'
        ],
        series: [
          {
            name: 'Estado',
            type: 'pie',
            stillShowZeroSum: false,
            radius: ['35%', '60%'],
            labelLine: {
              length: 0
            },
            data: this.solicitudStatusData
            
          }
        ]
      }
    }else{
      this._chartOptionStatus={
        tooltip: {
          trigger: 'item',
          confine: true,
          extraCssText: 'width:auto; white-space:pre-wrap;',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          
          data: this.solicitudStatusData.map(s => ({ name: s.name }))
        },
        color: [
          '#ffa1b5',
          '#86c7f3',
          '#ffe29a',
          '#f1f2f4',
          '#93d9d9'
        ],
        series: [
          {
            name: 'Estado',
            type: 'pie',
            stillShowZeroSum: false,
            radius: ['35%', '60%'],
            labelLine: {
              length: 0
            },
            label: {
              
            formatter: function(d:any) {
                return '{hr|}\n  {b|'+d.data.type+'：}{c| S/ '+ d.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'}  ';
              },
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
            //top:60,
              borderWidth: 2,
              borderRadius: 4,
              overflow: 'break',
              rich: {
                
                hr: {
                  borderColor: '#8C8D8E',
                  width: '100%',
                  borderWidth: 1,
                  height: 0
                },
                c:{
                  
                  lineHeight: 5,
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4
                },
                b: {
                  color: '#4C5058',
                  fontSize: 12,
                  fontWeight: 'bold',
                  lineHeight: 33
                },
                per: {
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4
                }
              }
            },
            data: this.solicitudStatusData
            
          }
        ]
      }
    }

   
  }

  private SolicitudEtapasDonutEchart(chartData:BasicEchartLineModel[]){
    if (this.screenWidth < 700){
      this._chartOptionEtapas={
        tooltip: {
          trigger: 'item',
           formatter: '{b}: {c} ({d}%)',
           confine: true,
           extraCssText: 'width:auto; white-space:pre-wrap;',
        },
        legend: {
          data: this.solicitudEtapasData.map(item => ({ name: item.name  }))
          
        },
        color: [
          '#ffa1b5',
          '#86c7f3',
          '#ffe29a',
          '#f1f2f4',
          '#93d9d9'
        ],
        series: [
          {
            name: 'Etapa',
            type: 'pie',
            stillShowZeroSum: false,
            radius: ['35%', '60%'],
            labelLine: {
              length: 0
            },
            data: this.solicitudEtapasData
                 
          }
        ]
      }
    }else{
      this._chartOptionEtapas={
        tooltip: {
          trigger: 'item',
           formatter: '{b}: {c} ({d}%)',
           confine: true,
           extraCssText: 'width:auto; white-space:pre-wrap;',
        },
        legend: {
          data: this.solicitudEtapasData.map(item => ({ name: item.name  }))
          
        },
        color: [
          '#ffa1b5',
          '#86c7f3',
          '#ffe29a',
          '#f1f2f4',
          '#93d9d9'
        ],
        series: [
          {
            name: 'Etapa',
            type: 'pie',
            stillShowZeroSum: false,
            radius: ['35%', '60%'],
            labelLine: {
              length: 0
            },
            label: {
              
            formatter: function(d:any) {
                return '{hr|}\n  {b|'+d.data.type+'：}{c|'+ d.value+'}  ';
              },
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
            //top:60,
              borderWidth: 2,
              borderRadius: 4,
              overflow: 'break',
              rich: {
                
                hr: {
                  borderColor: '#8C8D8E',
                  width: '100%',
                  borderWidth: 1,
                  height: 0
                },
                c: {
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4
                },
                b: {
                  color: '#4C5058',
                  fontSize: 12,
                  fontWeight: 'bold',
                  lineHeight: 33
                },
                per: {
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4
                }
              }
            },
            data: this.solicitudEtapasData
                 
          }
        ]
      }
    }
    
  }

  getDetailPath(id: number): void {
    this.router.navigate(['/humanmanagement/request-medical-config',id], {
      skipLocationChange: true
    })
  }
}
