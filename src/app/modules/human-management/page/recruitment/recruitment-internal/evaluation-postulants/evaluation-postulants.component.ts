import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { InfoReportIntegradoDto } from "./../../../../../../data/schema/reportExternIntegradoDto";
import { EvaluationMultitestExternDto } from "./../../../../../../data/schema/reportExternIndividualDto";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MultitestService } from "./../../../../../../data/service/multitest.service";
import { environment } from "environments/environment";
import { ActivatedRoute, Router } from "@angular/router";
import { EvaluationPostulantInternalService } from "./../../../../../../data/service/evaluation-postulant-internal.service";
import {
  EvaluationDto,
  EvaluationPostulantDto,
} from "./../../../../../../data/schema/evaluation-postulant";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { InfoReportIndividualInternDto } from "@app/data/schema/reportInternIndividualDto";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { NgxSpinnerService } from "ngx-spinner";
import { NotesEvaluationDto } from '@app/data/schema/notes-evaluation';
import { EmployeeService } from '@app/data/service/employee.service';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogPostulantInternalComponent } from '../dialog-postulant-internal/dialog-postulant-internal.component';

@Component({
  selector: "app-evaluation-postulants.component.html",
  templateUrl: "evaluation-postulants.component.html",
  styleUrls: ["./evaluation-postulants.component.scss"],
})
export class EvaluationPostulantsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  flowDT: MatTableDataSource<any> = new MatTableDataSource([]);
  totalRows = 0;
  pageSize = 10;
  scarreer:string = "";
  grado:string = "";
  currentPage = 0;
  notes:  NotesEvaluationDto[] = [];
  pageSizeOptions: number[] = [5, 10, 25, 100];

  dto: EvaluationDto;
  showSelectPosition: boolean = true;
  listBackground = [
    "#EC407A",
    "#AB47BC",
    "#42A5F5",
    "#7E57C2",
    "#66BB6A",
    "#FFCA28",
    "#26A69A",
  ];

  displayedColumns: string[] = [
    "action",
    "fullNamePostulant",
    "emailPostulant",
    "phoneNumberPostulant",
    "descripcionState",
  ];

  labelsChart: string[] = [
    "Inteligencia General",
    "Aptitud Verbal",
    "Aptitud Numérica",
    "Aptitud Espacial",
    "Aptitud Abstracta",
  ];

  _chartOptionObj: EChartsOption;
  _chartOptionObjDataSet: EChartsOption;

  dtoEvaluation: EvaluationPostulantDto = {
    id: null,
    approved: null,
    idEvaluation: null,
    idPostulant: null,
    state: null,
    onlySave: false,
  };
  idEvaluation: number;
  proceso: number;
  reportDto: InfoReportIndividualInternDto = {
    infoPerson: { sfirstname: "", sage: null, saddress: "", scivil_status: "" },
    infoEvaluationMultitest: {
      idEvaluation: null,
      idPostulant: null,
      postulant: "",
      scoreAptitudAbstracta: null,
      scoreAptitudEspacial: null,
      scoreAptitudNumerica: null,
      scoreAptitudVerbal: null,
      scoreIntelligence: null,
    },
    infoEvaluationProficiencyActually: [],
    infoEvaluationProficiencyFuture: [],
    infoEvaluationRating: [],
    positionApplicant: "",
  };

  basicOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#00000",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#00000",
        },
        grid: {
          color: "rgba(255,255,255,0.2)",
        },
      },
      y: {
        ticks: {
          color: "#00000",
        },
        grid: {
          color: "rgba(255,255,255,0.2)",
        },
      },
    },
  };
  basicData: any;

  stackedData: any;

  stackedOptions: any;

  reportIntegradoDto: InfoReportIntegradoDto = {
    infoEvaluationMultitest: [],
    infoEvaluationProficiency: [],
    infoEvaluationRating: [],
    positionApplicant: "",
  };

  eventSubscribe: Subscription;
  isRHHProfile: boolean = false;

  constructor(
    private _serviceEmployee: EmployeeService,
    private evaluationService: EvaluationPostulantInternalService,
    private route: ActivatedRoute,
    private router: Router,
    private multitestService: MultitestService,
    private snack: MatSnackBar,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.isRHHProfile = environment.perfilGerenteLiderRRHH.indexOf(storage.nid_profile) > -1;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      if (params) {
        this.idEvaluation = parseFloat(params.get("id"));
          this.getEvaluation(); 
        
      }
    });

    this.eventSubscribe = this.evaluationService.eventServiceReportIndividual.subscribe(res => {
      this.downloadPDFIntegrado();
    }, err => {

    }, () => {
    });
    
  }

  getEvaluation() {
    if (Number.isNaN(this.idEvaluation)){
      Swal.fire({ 
        icon: 'warning',
        text: `No existen postulantes para la Evaluación.`
      }).then(res => {
        this.router.navigate(
          [`humanmanagement/recruitment`], {
            skipLocationChange: true
          }
        );
      });
      return;
    }
    
    this.evaluationService.getEvaluation(this.idEvaluation).subscribe((res) => {
     
      setTimeout(() => {
        this.dto = res.data;
        
        this.proceso = this.dto.process;
        this.flowDT.data = this.dto.postulantDtos;
        this.showSelectPosition = res.dataDetail;
      }, 500);
    });
  }

  updateProcesoEvaluacion() {
    const obj = {
      id: this.dto.id,
      codRequerimiento: this.dto.codRequerimiento,
      state: 0,
      positionRequired: this.dto.positionRequired,
      process: this.proceso,
    };

    this.evaluationService.updateEvaluationProcess(obj).subscribe((res) => {
      if (res.stateCode === 200) {
        this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
        this.getEvaluation();
      } else {
        this.snack.open(res.messageError[0], "Error", { duration: 4000 });
      }
    });
  }

  generateInforme() {
    this.notes=[];
    for(let k=0;k<this.dto.postulantDtos.length;k++)
    {
      this.getNotes(this.dto.postulantDtos[k].id,this.dto.postulantDtos[k].fullNamePostulant);
    }
    this.evaluationService.generateInforme(this.idEvaluation)
      .subscribe((res) => {
        if (res.stateCode == 200) {
          this.reportIntegradoDto = res.data; 
          
          this.loadChartIntegrado(
            this.reportIntegradoDto.infoEvaluationMultitest
          );
          this.changeDetector.detectChanges();
        }
      }, err => {

      }, () => {
       this.spinner.show();
        setTimeout(()=>{        
                this.spinner.hide();                   //<<<---using ()=> syntax
                this.downloadPDFIntegrado();
          }, 900);
       // setTimeout(this.downloadPDFIntegrado,900)
        //this.evaluationService.eventServiceReportIndividual.emit(true);
      });

     // this.downloadPDFIntegrado();
  }

  getNewScore(_note: number){
    let _newNote = 0;
    if (_note >= 0 &&  _note <=80) _newNote = 1;
    else if (_note > 80 &&  _note < 95) _newNote = 2;
    else if (_note >= 95 &&  _note <= 105) _newNote = 3;
    else if (_note > 105 &&  _note <= 120) _newNote = 4;
    else if (_note > 120 &&  _note <= 134) _newNote = 5;
    else if (_note >= 135) _newNote = 6; 
    return _newNote;
  }
  ListStudenEmployee(IdEmployee: number): void {
    this._serviceEmployee.getListStuden(104).subscribe(resp => { //MODIFICAR CUANDO SE PUEDA GUARDAR EMPLEO
      
      this.scarreer= resp[0].scarreer;
      this.grado=resp[0].scurrent_cycle;

    })
  }
  getNotes(id,postulantName) {
    this.evaluationService.getNotes(id).subscribe(res => {
      
      res.data.forEach(element => {
        let nota =
        {
          active:element.active,
          autor:element.autor,
          dateRegister:element.dateRegister,
          dateUpdate:element.dateUpdate,
          descripcion:element.descripcion,
          id:element.id,
          idEvaluationPostulant:element.idEvaluationPostulant,
          idUserRegister:element.idUserRegister,
          idUserUpdate:element.idUserUpdate,
          postulantName:postulantName
        }
           this.notes.push(nota);
           
        
      });


    });    
  }

  loadChart(multitest: EvaluationMultitestExternDto) {
    this._chartOptionObj = {
      xAxis: {
        type: 'category',
        data: this.labelsChart,
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        }
      },
      series: [
        {
          data: [
            multitest.scoreIntelligence,
            multitest.scoreAptitudVerbal,
            multitest.scoreAptitudNumerica,
            multitest.scoreAptitudEspacial,
            multitest.scoreAptitudAbstracta,
          ],
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            color: "#000000"
          },
          itemStyle: {
            color: '#536BB2'
          },
          emphasis: {
            itemStyle: {
              color: '#DE9310'
            }
          }
        }
      ]
    }
  }

  downloadPDFIndividual(nombre_Postulante) {
    // Extraemos el
   // this.spinner.show();
    let namePostulant=nombre_Postulante;
    const DATA = document.getElementById("reporteindividual");
    const doc = new jsPDF("p", "pt", "a4");
    const options = {
      background: "white",
      scale: 0.8,
    };
    html2canvas(DATA, options)
      .then((canvas) => {
        var imgData = canvas.toDataURL('image/png');
        var imgWidth = 210; 
        var pageHeight = 295;  
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        var doc = new jsPDF('p', 'mm');
        var position = 0;
        const bufferX = 0;
        const bufferY = 8;
        
        doc.addImage(imgData, 'PNG',  bufferX, bufferY, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        return doc;
      })
      .then((docResult) => {
     //   this.spinner.hide();
        docResult.save(`ReporteIndividual_${namePostulant}_${new Date().toISOString()}.pdf`);
      });
  }

  downloadPDFIntegrado() {
    //this.spinner.show();
    // Extraemos el
    const DATA = document.getElementById("reporteIntegrado");
    const doc = new jsPDF("p", "pt", "a4");
    const options = {
      background: "white",
      scale: 0.8,
    };    
    
    html2canvas(DATA, options)
      .then((canvas) => {
        var imgData = canvas.toDataURL('image/png');
        var imgWidth = 210; 
        var pageHeight = 295;  
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        var doc = new jsPDF('p', 'mm');
        var position = 0;
        const bufferX = 0;
        const bufferY = 8;
        
        doc.addImage(imgData, 'PNG',  bufferX, bufferY, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        return doc;
      })
      .then((docResult) => {
     //   this.spinner.hide();
        docResult.save(`ReporteIntegrado_${new Date().toISOString()}.pdf`);
      });
  }

  loadChartIntegrado(multitest: EvaluationMultitestExternDto[]) {    
    let _listSeries = [];
    let _objLegend = {
      data: []
    };
    let i = 0;
    multitest.forEach((item) => {
      let _objSerie = {};
      _objSerie['type'] = 'bar';
      _objSerie['label'] = {
            show: true,
            position: 'top',
            color: "#000000"
      };
      _objSerie['data'] = [
          item.scoreIntelligence,
          item.scoreAptitudVerbal,
          item.scoreAptitudNumerica,
          item.scoreAptitudEspacial,
          item.scoreAptitudAbstracta,
      ];
      _objSerie['itemStyle'] = {
        color: this.listBackground[i]
      };
      _objSerie['name'] = item.postulant;
      _objLegend.data.push(item.postulant);
      _listSeries.push(_objSerie);
      i++;
      i = i == 7 ? 0 : i;
    });
    
    this._chartOptionObjDataSet = {
      xAxis: {
        type: 'category',
        data: this.labelsChart,
        splitLine: {
          show: false
        }
      },
      legend: _objLegend,
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        }
      },
      series: _listSeries
    };
  }

  downLoad(archivo, contentType, name) {
    let link = document.createElement("a");
    let blobArchivo = this.base64ToBlob(archivo, contentType);
    let blob = new Blob([blobArchivo], { type: contentType });
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
  }

  public base64ToBlob(b64Data, contentType = "", sliceSize = 512) {
    b64Data = b64Data.replace(/\s/g, ""); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  generateReportPostulant(id,nombre) {
    this.ListStudenEmployee(id);
    let _namePostulant=nombre;
    this.notes=[];
    this.getNotes(id,_namePostulant);
    this.evaluationService.generateReportPostulant(id).subscribe((res) => {
      if (res.stateCode == 200) {
        this.reportDto = res.data;
        this.loadChart(this.reportDto.infoEvaluationMultitest);
        this.changeDetector.detectChanges();
      }
    }, err => {

    }, () => {
        // setTimeout(this.downloadPDFIndividual, 900);
      setTimeout(() => {
        this.downloadPDFIndividual(_namePostulant);
      }, 900);
    });
  }

  updateEvaluation(row) {
    
    
    this.dtoEvaluation.id = row.id;
    this.dtoEvaluation.idPostulant = row.idPostulant;
    this.dtoEvaluation.state = 908;
    this.dtoEvaluation.idEvaluation = row.idEvaluation;
    let any = [];

    const formdata = new FormData();
    formdata.append("request", JSON.stringify(this.dtoEvaluation));
    formdata.append("multitest", JSON.stringify(any));

    this.evaluationService.updateEvaluation(formdata).subscribe(
      (res) => {
        if (res.stateCode == 200) {
          this.router.navigate(
            [`/humanmanagement/evaluation-postulant/${row.id}`], {
              skipLocationChange: true
            }
          );
        }
      },
      (err) => {},
      () => {
        this.AuthMultitest();
      }
    );
  }

  AuthMultitest() {
    const dataurl = new URLSearchParams();
    dataurl.set("username", environment.usernameMulti);
    dataurl.set("password", environment.passwordMulti);
    this.multitestService.authenticate(dataurl).subscribe((res) => {
      if (res) {
        localStorage.setItem("tokenmultitest", res.token);
        localStorage.setItem("infomultitest", JSON.stringify(res.user_info));
      }
    });
  }

  selectedPosition(row) {
    this.dtoEvaluation.id = row.id;
    this.dtoEvaluation.idPostulant = row.idPostulant;
    this.dtoEvaluation.state = 911;
    this.dtoEvaluation.idEvaluation = row.idEvaluation;
    let any = [];

    const formdata = new FormData();
    formdata.append("request", JSON.stringify(this.dtoEvaluation));
    formdata.append("multitest", JSON.stringify(any));

    this.evaluationService.updateEvaluation(formdata).subscribe((res) => {
      if (res.stateCode == 200) {
        this.getEvaluation();
      }
    });
  }

  valideKey(evt) {
    // code is the decimal ASCII representation of the pressed key.
    var code = evt.which ? evt.which : evt.keyCode;

    if (code == 8) {
      // backspace.
      return true;
    } else if (code >= 48 && code <= 57) {
      // is a number.
      return true;
    } else {
      // other keys.
      return false;
    }
  }

  exportar(): void {
    
   
        this.evaluationService.getEvaluationExport(this.idEvaluation).subscribe(//(res) => {
         (res: any) => {
          //  this.flowDT.data = res;
          

          try {
          const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          const b64Data = res;
          
          const blob = this.b64toBlob(b64Data, contentType);
          
          const blobUrl = URL.createObjectURL(blob);
          
          const _afile = document.getElementById('afile') as HTMLAnchorElement;
          _afile.href = blobUrl;
          _afile.download = 'Reporte de Evaluacion Interno.xlsx'
          _afile.click();
          window.URL.revokeObjectURL(blobUrl);
        } catch (e) {
        }
      }, (error: any) => {

        var obj = error;
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

  getDetailPath(id: number): void {
    this.router.navigate(['/humanmanagement/evaluation-postulant',id], {
      skipLocationChange: true
    })
  }

  //nuevo ficha del postulante
  openFilePostulant(data: any = {}) {    
    let title = "Ficha del Postulante"; 
    let dataToSend = data;
    dataToSend.isAdministration = false;
    dataToSend.permitConfirmar = false;
    dataToSend.permitSendExactus = false;
    let dialogRef: MatDialogRef<any> = this.dialog.open(DialogPostulantInternalComponent, {
      width: "100vw",
      maxWidth: '100vw',
      disableClose: true,
      data: { title: title, payload: {idEvaluation:this.idEvaluation, data: dataToSend} },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
    });   
  }
}
