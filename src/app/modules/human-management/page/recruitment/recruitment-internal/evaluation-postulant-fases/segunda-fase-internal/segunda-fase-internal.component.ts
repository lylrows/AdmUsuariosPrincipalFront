import { UtilService } from './../../../../../../../data/service/util.service';
import { environment } from 'environments/environment';
import { MultitestService } from './../../../../../../../data/service/multitest.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationPostulantInternalService } from './../../../../../../../data/service/evaluation-postulant-internal.service';
import { EvaluationPostulantDto } from './../../../../../../../data/schema/evaluation-postulant';
import { NotesEvaluationDto } from './../../../../../../../data/schema/notes-evaluation';
import { PostulantInternalInfoDto } from './../../../../../../../data/schema/PostulantInternal/postulantInternal';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-segunda-fase-internal',
    templateUrl: 'segunda-fase-internal.component.html',
    styleUrls: ['./segunda-fase-internal.component.scss']
})

export class SegundaFaseInternalComponent implements OnInit, OnChanges {
    @Input() person: PostulantInternalInfoDto;
    @Input() notas: NotesEvaluationDto[];
    @Input() idEvaluation: number;
    @Output() createnote = new EventEmitter();
    @Output() updateevaluation = new EventEmitter();
    
    basicData: any;
    archivoMultitest: any;
    nameArchivoMultitest: any;
    textbutton: string = "Continuar proceso";
    loadMultitest: boolean = false;
    infoMultitest: any;
    listTestMulti: any;

    basicOptions = {
      plugins: {
        legend: {
          display: false,
        }
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
    _chartOptionObj: EChartsOption;
    _chartOptionObjResponsive: EChartsOption;
    labelsChartResponsive: string[] = [
      "Int. \nGeneral",
      "Apt. \nVerbal",
      "Apt. \nNumérica",
      "Apt. \nEspacial",
      "Apt. \nAbstracta",
    ];

    dtoEvaluation: EvaluationPostulantDto = {
        id: null,
        approved: null,
        idEvaluation: null,
        idPostulant: null,
        state: null,
        onlySave: false
      };

      notes: NotesEvaluationDto = {
        autor: "",
        dateRegister: "",
        descripcion: "",
        id: null,
        idEvaluationPostulant: null,
      };
    constructor(private evaluationService: EvaluationPostulantInternalService, 
                private snack: MatSnackBar, 
                private multitest: MultitestService,
                private router: Router,
                private utilService: UtilService,
                private dialog: MatDialog) { 
    }

    ngOnInit() {
     
     }

     ngOnChanges(changes: SimpleChanges): void {
      if (changes.person && changes.person.currentValue != undefined) {
         this.person = changes.person.currentValue;
         this.getEvaluationPostulant();
      }
     }

    changeAction($event) {
        if ($event.value == true) {
          this.textbutton = "Continuar proceso";
        } else {
          this.textbutton = "Terminar proceso";
        }
    }

    changeFile2(event) {
      this.archivoMultitest = event.target.files[0];
      this.nameArchivoMultitest = this.archivoMultitest.name;
      
    }

    createNotes() {
        this.notes.autor = "RRHH";
        this.notes.idEvaluationPostulant = this.idEvaluation;
        this.evaluationService.createNotes(this.notes).subscribe((res) => {
          if (res.stateCode == 200) {
            this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
            this.createnote.emit(true);
            this.notes.descripcion = '';
          } else {
            this.snack.open(res.messageError[0], "Error", { duration: 4000 });
          }
        });
    }

    getInforme() {
      
      var url =  this.formatUrl(
          this.infoMultitest.ruc,
          this.person.process,
          this.person.informationPersonal.sidentification,
          "pdf"
        );
  
        let link = document.createElement("a");
        link.href = url;
        link.target = 'blank';
        link.download = 'Informe de evaluación';
        link.click();
    }
  
    formatUrl(ruc, processId, dni, tipoarchivo) {
      return `${environment.apiMultitestPdf}${ruc}/${processId}/0/${dni}/${tipoarchivo}/null/1/1`
    }
  
    getEvaluationPostulant() {
      this.infoMultitest = JSON.parse(localStorage.getItem("infomultitest"));
      
      let obj = {
        ruc: this.infoMultitest.ruc,
        processId: this.person.process,
        
        dni: environment.validateWithRealDocument ? this.person.informationPersonal.sidentification : "46952613"
      };
      
      if(this.person.process == null || this.person.process == 0){
        this.snack.open("No se ha grabado la Evlauación Multitest", "OK", { duration: 4000 });    
        return;
      }

      this.utilService
        .getInfoPruebaMultitest(
         obj 
        )
        .subscribe(
          (res) => {
            
            if (res.stateCode == 200) {
              try {
                var resp = JSON.parse(res.data);
                this.listTestMulti = resp.data.report.results.individual;
                
                this.listTestMulti.factors.map(res => {
                  res.score = this.getNewScore(res.score);             
                });
                
                this.loadMultitest = true;
                this.loadChart(this.listTestMulti.factors);
              } catch(e) {
                this.snack.open("No se encontro Evaluación Multitest registrada", "OK", { duration: 4000 });   
                
                return;
              }              
            } else {
              this.loadMultitest = false;
            }
          },
          (err) => {
            this.loadMultitest = false;
          }
        );
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

    loadChart(categorias) {
      var labels = categorias.map((res) => res.description);
      var values = categorias.map((res) => res.score);
  
      this._chartOptionObj = {
        xAxis: {
          type: 'category',
          data: labels,
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
            data: values,
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

      this._chartOptionObjResponsive = {
        xAxis: {
          type: 'category',
          data: this.labelsChartResponsive,
          axisLabel: { interval: 0, rotate: 40 },
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
            data: values,
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
        b64Data = b64Data.replace(/\s/g, ""); 
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


      saveEvaluation() {
        this.dtoEvaluation.id = this.idEvaluation;
        this.dtoEvaluation.idPostulant = this.person.informationPersonal.nid_person;
        this.dtoEvaluation.state = 909;
        this.dtoEvaluation.idEvaluation = this.person.idEvaluation;
        this.dtoEvaluation.onlySave = true;
    
        const formdata = new FormData();
        formdata.append("request", JSON.stringify(this.dtoEvaluation));
    
        this.evaluationService.updateEvaluation(formdata).subscribe((res) => {
          if (res.stateCode == 200) {
            this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
            this.updateevaluation.emit(false);
          } else {
            this.snack.open(res.messageError[0], "Error", { duration: 4000 });
          }
        });
      }

      aprovedEvaluation(){
        this.dtoEvaluation.approved = true;
        this.updateEvaluation();
      }
    
      rejectEvaluation(){
        this.dtoEvaluation.approved = false;
        this.updateEvaluation();
      }

      updateEvaluation() {
        this.dtoEvaluation.id = this.idEvaluation;
        this.dtoEvaluation.idPostulant = this.person.informationPersonal.nid_person;
        this.dtoEvaluation.state = this.dtoEvaluation.approved ? 910 : 912;
        this.dtoEvaluation.idEvaluation = this.person.idEvaluation;
    
        const formdata = new FormData();
        formdata.append("request", JSON.stringify(this.dtoEvaluation));
        formdata.append("multitest", JSON.stringify(this.listTestMulti.factors));
    
        this.evaluationService.updateEvaluation(formdata).subscribe((res) => {
          if (res.stateCode == 200) {
            this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
            this.updateevaluation.emit(false);
          } else {
            this.snack.open(res.messageError[0], "Error", { duration: 4000 });
          }
        });
      }

      getDetailPath(id: number): void {
        this.close();
        this.router.navigate(['/humanmanagement/evaluation-postulants/',id], {
          skipLocationChange: true
        })
      }

      close(): void {
        this.dialog.closeAll();
      }
}