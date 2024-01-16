import { environment } from 'environments/environment';
import { AfterViewInit, ChangeDetectorRef, TemplateRef, ViewChild } from "@angular/core";
import { EvaluationProficiencyDto } from "./../../../../../../data/schema/evaluation-proficiency";
import { EvaluationRatingPostulantDto } from "./../../../../../../data/schema/evaluation-rating";
import { PostulantInternalInfoDto } from "./../../../../../../data/schema/PostulantInternal/postulantInternal";
import { EvaluationPostulantInternalService } from "./../../../../../../data/service/evaluation-postulant-internal.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NotesEvaluationDto } from "./../../../../../../data/schema/notes-evaluation";
import { PostulantInfoDto } from "./../../../../../../data/schema/Postulant/postulant";
import { Component, OnInit } from "@angular/core";
import { MultitestService } from '@app/data/service/multitest.service';
import { InfoReportIndividualInternDto } from '@app/data/schema/reportInternIndividualDto';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { EvaluationMultitestExternDto } from '@app/data/schema/reportExternIndividualDto';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: "app-evaluation-postulant-fases",
  templateUrl: "evaluation-postulant-fases.component.html",
  styleUrls: ["./evaluation-postulant-fases.component.scss"],
})
export class EvaluationPostulantFasesComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('DetailDialog') DetailDialog: TemplateRef<any>;
  idEvaluation: number;
  person: PostulantInternalInfoDto;
  notes: NotesEvaluationDto[] = [];
  evaluationProficiency: EvaluationProficiencyDto[];
  evaluationProficiencyActually: EvaluationProficiencyDto[];
  evaluationRating: EvaluationRatingPostulantDto[];
  tabIndex: number;
  nid_profile: number = 0;
  perfilesGerenteLiderRRHH: number[];
  perfilesJefeArea: number[];
  perfilesGerenteArea: number[];

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
  responsive = false;
  screenWidth: number;
  
  constructor(
    private route: ActivatedRoute,
    private evaluationService: EvaluationPostulantInternalService,
    private multitestService: MultitestService,
    private _router: Router, 
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.AuthMultitest();
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_profile = storage.nid_profile;
    this.perfilesGerenteLiderRRHH = environment.perfilGerenteLiderRRHH;
    this.perfilesJefeArea = environment.perfilJefeArea;
    this.perfilesGerenteArea = environment.perfilGerenteArea;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 600){
      this.responsive = true; 
    } 
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      if (params) {
        this.idEvaluation = parseFloat(params.get("id"));
        this.getInfoPostulantSer(false);
        this.getNotes();

      }
    });
  }

  ngAfterViewInit(): void {

  }

  verEvaluacion() {
    if (this.responsive){
      this.getInfoPostulantSer(false)
      this.dialog.open(this.DetailDialog,{
        width: '100%',
        maxWidth: '100hv'
      });
    }
  }

  close(): void {
    this.dialog.closeAll();
  }

  getInfoPostulantSer($event) {
    if ($event) {
      this.dialog.closeAll();
    }
    let _noEstaEnArea = false;
    this.evaluationService.getInfoPostulant(this.idEvaluation).subscribe(
      (res) => {
        this.person = res.data;
        
      },
      (err) => {},
      () => {
        switch (this.person.stateEvaluation) {
          case "Evaluación - primera fase":
            this.tabIndex = 0;
            break;
          case "Evaluación - segunda fase":
            this.tabIndex = 1;
            break;
          case "Evaluación - tercera fase":
            this.tabIndex = 2;
            break;
          case "Evaluación - cuarta fase":
            this.tabIndex = 3;
            break;
          case "Seleccionado":
            this.tabIndex = 4; 
            break;
          default:
            break;
        }

        let _fase = '';
        switch(this.tabIndex) {
          case 0:
            _fase = 'Evaluación General'
            break;
          case 1:
            _fase = 'Evaluación RRHH: Parte I'
            break;
          case 2:
            _fase = 'Evaluación RRHH: Parte II'
            break;
        }

        if (this.perfilesGerenteArea.indexOf(this.nid_profile) > -1 && [0,1,2].indexOf(this.tabIndex) > -1) _noEstaEnArea = true;
        if (this.perfilesJefeArea.indexOf(this.nid_profile) > -1 && [0,1,2].indexOf(this.tabIndex) > -1) _noEstaEnArea = true;


        if(_noEstaEnArea){
          Swal.fire({
              icon: 'warning',
              text: `El Candidato se encuentra en el proceso: ${ _fase }. 
                      Por favor, ingresar cuando se le notifique vía correo electrónico. \nGracias.`
            }).then(() => {
              this._router.navigate(['/humanmanagement/recruitment'], {
                  skipLocationChange: true
                });
            });
      } else {
        this.getEvaluationProficiency();
        this.getEvaluationRating();
        this.getEvaluationProficiencyActually();
      } 
      }
    );
  }

  getNotes() {
    this.evaluationService.getNotes(this.idEvaluation).subscribe((res) => {
      this.notes = res.data;
    });
  }

  changeNotes($event) {
    this.getNotes();
  }

  getEvaluationProficiency() {
    this.evaluationService
      .getEvaluationProficiencyIntern(
        this.person.idEvaluation,
        this.person.informationPersonal.nid_person,
        1
      )
      .subscribe((res) => {
        this.evaluationProficiency = res.data;
      });
  }

  getEvaluationProficiencyActually() {
    this.evaluationService
      .getEvaluationProficiencyIntern(
        this.person.idEvaluation,
        this.person.informationPersonal.nid_person,
        2
      )
      .subscribe((res) => {
        this.evaluationProficiencyActually = res.data;
      });
  }

  getEvaluationRating() {
    this.evaluationService
      .getEvaluationFortalezasIntern(
        this.person.idEvaluation,
        this.person.informationPersonal.nid_person
      )
      .subscribe((res) => {
        this.evaluationRating = res.data;
      });
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

  generateReportPostulant(id) {
    this.evaluationService.generateReportPostulant(id).subscribe((res) => {
      if (res.stateCode == 200) {
        this.reportDto = res.data;
        this.loadChart(this.reportDto.infoEvaluationMultitest);
        this.changeDetector.detectChanges();
      }
    }, err => {

    }, () => {
        setTimeout(this.downloadPDFIndividual, 900);
    });
  }

  downloadPDFIndividual() {
   
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
     
        docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
      });
  }

  loadChart(multitest: EvaluationMultitestExternDto) {
    this.basicData = {
      labels: [
        "Inteligencia General",
        "Aptitud Verbal",
        "Aptitud Numérica",
        "Aptitud Espacial",
        "Aptitud Abstracta",
      ],
      datasets: [
        {
          label: "Puntaje",
          backgroundColor: "#42A5F5",
          data: [
            multitest.scoreIntelligence,
            multitest.scoreAptitudVerbal,
            multitest.scoreAptitudNumerica,
            multitest.scoreAptitudEspacial,
            multitest.scoreAptitudAbstracta,
          ],
        },
      ],
    };
  }
}
