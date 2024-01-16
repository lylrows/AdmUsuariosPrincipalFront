import { MultitestService } from './../../../../../data/service/multitest.service';
import { environment } from 'environments/environment';
import { EvaluationPostulantDto } from './../../../../../data/schema/evaluation-postulant';
import { PostulantDto, PostulantInfoDto } from './../../../../../data/schema/Postulant/postulant';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationPostulantService } from '@app/data/service/evaluation-postulant.service';
import { NotesEvaluationDto } from '@app/data/schema/notes-evaluation';
import { EvaluationProficiencyDto } from '@app/data/schema/evaluation-proficiency';
import { EvaluationRatingPostulantDto } from '@app/data/schema/evaluation-rating';
import { EvaluationPostulantDocumentsDto } from '@app/data/schema/evaluation-documents';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-evaluation-postulant',
    templateUrl: 'recruitment-evaluation-postulant.component.html',
    styleUrls: ['./recruitment-evaluation-postulant.component.scss']
})

export class RecruitmentEvaluationPostulantComponent implements OnInit, AfterViewInit {

    @ViewChild('DetailDialog') DetailDialog: TemplateRef<any>;
    idEvaluation: number;
    person:PostulantInfoDto;
    notes:  NotesEvaluationDto[] = [];
    documents: EvaluationPostulantDocumentsDto;
    tabIndex: number;
    evaluationProficiency: EvaluationProficiencyDto[];
    evaluationRating: EvaluationRatingPostulantDto[];
    nid_profile: number = 0;
    perfilesGerenteLiderRRHH: number[];
    perfilesJefeArea: number[];
    perfilesGerenteArea: number[];
    responsive = false;
    screenWidth: number;

    constructor(
        private route: ActivatedRoute, 
        private evaluationService: EvaluationPostulantService, 
        private _router: Router, 
        private multitestService: MultitestService,
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
              this.getInfoPostulant();
              this.getNotes();
              this.getDocunentsPostulant();
            }
          });
    }

    ngAfterViewInit(): void {
    }

    verEvaluacion() {
        if (this.responsive){
          this.dialog.open(this.DetailDialog,{
            width: '100%',
            maxWidth: '100hv'
          });
        }
      }

    getInfoPostulant() {
        let _noEstaEnArea = false;
        this.evaluationService.getInfoPostulant(this.idEvaluation).subscribe(res => {
            
            this.person = res.data;
        },
        err => {
            
        }, 
        () => {
            switch (this.person.stateEvaluation) {
                case 'Evaluación - primera fase':
                    this.tabIndex = 0;
                    break;
                case 'Evaluación - segunda fase':
                    this.tabIndex = 1;
                    break;
                case 'Evaluación - tercera fase':
                    this.tabIndex = 2;
                    break;    
                case 'Seleccionado':
                    this.tabIndex = 3;
                    break;   
                default:
                    break;
            }

            if (this.perfilesJefeArea.indexOf(this.nid_profile) > -1 && this.tabIndex > 0) {
                this.tabIndex = 1;
            } 
            

            if ((this.perfilesJefeArea.indexOf(this.nid_profile) > -1 || this.perfilesGerenteArea.indexOf(this.nid_profile) > -1) && this.tabIndex == 0) _noEstaEnArea = true;
            if (this.perfilesGerenteArea.indexOf(this.nid_profile) > -1 && this.tabIndex == 1) _noEstaEnArea = true;

            if(_noEstaEnArea){
                Swal.fire({
                    icon: 'warning',
                    text: `El Candidato se encuentra en el proceso: Entrevista ${this.person.stateEvaluation == 'Evaluación - primera fase' ?
                    'Recursos Humanos' : 'Jefe de Área'}. 
                            Por favor, ingresar cuando se le notifique vía correo electrónico. \nGracias.`
                  }).then(() => {
                    this._router.navigate(['/humanmanagement/recruitment'], {
                        skipLocationChange: true
                      });
                  });
            } else {
                this.getEvaluationProficiency();
                this.getEvaluationRating();
            }            
        })
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

    getNotes() {
        this.evaluationService.getNotes(this.idEvaluation).subscribe(res => {
             this.notes = res.data;
             
        });
    }

    changeNotes($event) {
        this.getNotes();
    }

    close(): void {
        this.dialog.closeAll();
    }

    changeInfoEvaluation($event) {
        if ($event) {
            this.dialog.closeAll();
        }
        this.getInfoPostulant();
    }

    getEvaluationProficiency() {
        this.evaluationService.getEvaluationProficiency(this.person.idEvaluation, this.person.informationPersonal.id).subscribe(res => {
             this.evaluationProficiency = res.data;
        });
    }

    getEvaluationRating() {
        this.evaluationService.getEvaluationRating(this.person.idEvaluation, this.person.informationPersonal.id).subscribe(res => {
             this.evaluationRating = res.data;
             
        });
    }

    getDocunentsPostulant() {
        this.evaluationService.getDocuments(this.idEvaluation).subscribe(res => {
            this.documents = res.data;
        })
    }

    changeProficiency($event) {
        this.getEvaluationProficiency();
    }

    changeRating($event) {
        this.getEvaluationRating();
    }

    changeDocuments($event) {
        this.getDocunentsPostulant();
    }
}