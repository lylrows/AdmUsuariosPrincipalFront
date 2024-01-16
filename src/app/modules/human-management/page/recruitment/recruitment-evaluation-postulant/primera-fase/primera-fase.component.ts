import { EChartsOption } from 'echarts';
import { UtilService } from '@app/data/service/util.service';
import { environment } from 'environments/environment';
import { MultitestService } from "./../../../../../../data/service/multitest.service";
import { EvaluationRatingPostulantDto } from "./../../../../../../data/schema/evaluation-rating";
import { EvaluationProficiencyDto } from "@app/data/schema/evaluation-proficiency";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EvaluationPostulantDto } from "./../../../../../../data/schema/evaluation-postulant";
import { EvaluationPostulantService } from "@app/data/service/evaluation-postulant.service";
import { PostulantInfoDto } from "./../../../../../../data/schema/Postulant/postulant";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  TemplateRef,
} from "@angular/core";
import { PostulantDto } from "@app/data/schema/Postulant/postulant";
import { NotesEvaluationDto } from "@app/data/schema/notes-evaluation";
import { EvaluationExternTestDto } from '@app/data/schema/evaluation-test';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RecruitmentDetailDocumentComponent } from '../../modals/recruitment-detail-document/recruitment-detail-document.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: "app-primera-fase",
  templateUrl: "primera-fase.component.html",
  styleUrls: ["primera-fase.component.scss"],
})
export class PrimeraFaseComponent implements OnInit, OnChanges {
  @Input() person: PostulantInfoDto;
  @Input() notas: NotesEvaluationDto[];
  @Input() idEvaluation: number;
  @Input() evaluationProficiency: EvaluationProficiencyDto[];
  @Input() evaluationRating: EvaluationRatingPostulantDto[];
  @Output() createnote = new EventEmitter();
  @Output() updateevaluation = new EventEmitter();
  @Output() updateproficiency = new EventEmitter();
  @Output() updaterating = new EventEmitter();
  @Input() tabNumber:number;

  listEvalTest: EvaluationExternTestDto[];
  listTestMulti: any;
  basicData: any = null;
  userInfo: any;
  evaluador: string = "rrhh";
  notes: NotesEvaluationDto = {
    autor: "",
    dateRegister: "",
    descripcion: "",
    id: null,
    idEvaluationPostulant: null,
  };

  dtoEvaluation: EvaluationPostulantDto = {
    id: null,
    approved: null,
    idEvaluation: null,
    idPostulant: null,
    state: null,
    onlySave: false
  };

  archivoCompetencias: File;
  archivoMultitest: File;
  nameArchivoCompetencias: string;
  nameArchivoMultitest: string;
  textbutton: string = "Continuar proceso";
  loadMultitest: boolean = false;
  infoMultitest: any;

    nid_profile:number;
    perfilesGerenteLiderRRHH: number[];
    perfilesJefeArea: number[];
    perfilesGerenteArea: number[];
    rutaHTMLCompetencias: SafeResourceUrl;
    _chartOptionObj: EChartsOption;
    _chartOptionObjResponsive: EChartsOption;
    labelsChartResponsive: string[] = [
      "Int. \nGeneral",
      "Apt. \nVerbal",
      "Apt. \nNumérica",
      "Apt. \nEspacial",
      "Apt. \nAbstracta",
    ];
  constructor(
    private evaluationService: EvaluationPostulantService,
    private snack: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private multitest: MultitestService,
    private utilService: UtilService,
    public sanitizer: DomSanitizer
  ) {
    this.userInfo = localStorage.getItem("userInfo");
    // this.rutaHTMLCompetencias = this.sanitizer.bypassSecurityTrustResourceUrl(environment.localhost + "assets/html/detalle-competencias.html");
    this.rutaHTMLCompetencias = this.sanitizer.bypassSecurityTrustResourceUrl(environment.localhost + "assets/html/detalle-competencias.html");
  }

  ngOnInit() {
    const storage = JSON.parse(localStorage.getItem('GRUPOFE_USER'));
    this.nid_profile=storage.nid_profile;
    this.perfilesGerenteLiderRRHH = environment.perfilGerenteLiderRRHH;
    this.perfilesJefeArea = environment.perfilJefeArea;
    this.perfilesGerenteArea = environment.perfilGerenteArea;
    
    this.getEvaluationsTest();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.person && changes.person.currentValue != undefined) {
      this.person = changes.person.currentValue;
      this.dtoEvaluation.approved = this.person.approved;
      if (this.person.fileCompetencias != null) {
        this.archivoCompetencias = this.person.fileCompetencias.file;
        this.nameArchivoCompetencias = this.person.fileCompetencias.nameFile;
      }

      if (this.person.fileMultitest != null) {
        this.archivoMultitest = this.person.fileMultitest.file;
        this.nameArchivoMultitest = this.person.fileMultitest.nameFile;
      }
      this.getEvaluationPostulant();
    }
  }

  changeFile1($event) {
    this.archivoCompetencias = $event.target.files[0];
    this.nameArchivoCompetencias = this.archivoCompetencias.name;
  }

  changeFile2($event) {
    this.archivoMultitest = $event.target.files[0];
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
    },(err) => {});
  }

  getEvaluationsTest() {
    this.evaluationService.getEvaluationTest(this.idEvaluation).subscribe(res => {
        this.listEvalTest = res.data;
    }, 
    (err) => {})
  }

  getInforme() {
    var url =  this.formatUrl(
        this.infoMultitest.ruc,
        this.person.process,
        environment.validateWithRealDocument ? this.person.informationPersonal.documentNumber : "46952613",
        "pdf"
      );

      let link = document.createElement("a");
      link.href = url;
      link.download = 'Informe de evaluación';
      link.target = 'blank';
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
      
      dni: this.person.informationPersonal.documentNumber
      
    };
    this.utilService
      .getInfoPruebaMultitest(
       obj
      )
      .subscribe(
        (res) => {
          if (res.stateCode == 200) {
            var resp = JSON.parse(res.data);
            this.listTestMulti = resp.data.report.results.individual;
            this.listTestMulti.factors.map(res => {
              res.score = this.getNewScore(res.score);         
            });
            this.loadMultitest = true;
            this.loadChart(this.listTestMulti.factors);
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

  changeAction($event) {
    if ($event.value == true) {
      this.textbutton = "Continuar reclutando";
    } else {
      this.textbutton = "Terminar reclutamiento";
    }
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
    };

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

  saveEvaluation() {
    this.dtoEvaluation.id = this.idEvaluation;
    this.dtoEvaluation.idPostulant = this.person.informationPersonal.id;
    this.dtoEvaluation.state = 908;
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
    //validar competencias:
    var _required = this.evaluationProficiency.filter(x => x.required == true && x.expectative > 0 && x.levelRRHH > 0);
    if (_required.length < 3) {
      this.snack.open("Debe completar los datos de las Competencias obligatorios.", "Error", { duration: 4000 });
      return;
    }

    if(this.loadMultitest)
    {
      this.dtoEvaluation.approved = true;
      this.updateEvaluation();      
    }
    else
      this.snack.open("El participante aún no culmina su evaluación Multitest.", "Error", { duration: 4000 });
  }

  rejectEvaluation(){
    if(this.loadMultitest)
    {
      this.dtoEvaluation.approved = false;
      this.updateEvaluation();
    }
    else
      this.snack.open("El participante aún no culmina su evaluación Multitest.", "Error", { duration: 4000 });
  }

  updateEvaluation() {
    let i=0
    this.evaluationProficiency.map((e) => {
      if (e != null) {
         if (e.levelRRHH == null) {
            i++;
         }
      }
    });
    if (i > 0) {
      this.snack.open("Tiene que completar la evaluación de competencias", "Validación", { duration: 4000 });
      return;
    }
    let j=0
    this.evaluationRating.map((e) => {
      if (e != null) {
         if (e.sRatingrrhhstrengths == "") {
            j++;
         }
         if (e.sRatingrrhhopportunities == "") {
          j++;
       }
      }
    });
    if (j > 0) {
      this.snack.open("Tiene que completar la evaluación de fortalezas", "Validación", { duration: 4000 });
      return;
    }

    this.dtoEvaluation.id = this.idEvaluation;
    this.dtoEvaluation.idPostulant = this.person.informationPersonal.id;
    this.dtoEvaluation.state = this.dtoEvaluation.approved ? 909 : 912;
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

  getDetailPath(id: number) {
    this.close();
    this.router.navigate(['/humanmanagement/recruitment-evaluation/',id], {
      skipLocationChange: true
    })
  }

  openModal() {
    window.open('/assets/html/detalle-competencias.pdf', '_blank');
  }

  close(): void {
    this.dialog.closeAll();
  }
}
