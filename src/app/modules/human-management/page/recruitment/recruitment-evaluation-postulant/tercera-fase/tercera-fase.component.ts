import { EvaluationRatingPostulantDto } from './../../../../../../data/schema/evaluation-rating';
import { EvaluationProficiencyDto } from '@app/data/schema/evaluation-proficiency';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationPostulantDto } from './../../../../../../data/schema/evaluation-postulant';
import { SimpleChanges } from '@angular/core';
import { OnChanges } from '@angular/core';
import { EvaluationPostulantService } from '@app/data/service/evaluation-postulant.service';
import { NotesEvaluationDto } from '@app/data/schema/notes-evaluation';
import { PostulantInfoDto } from './../../../../../../data/schema/Postulant/postulant';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { RecruitmentDetailDocumentComponent } from '../../modals/recruitment-detail-document/recruitment-detail-document.component';
@Component({
    selector: 'app-tercera-fase',
    templateUrl: 'tercera-fase.component.html',
    styleUrls: ['tercera-fase.component.scss']
})

export class TerceraFaseComponent implements OnInit, OnChanges {
    @Input() person: PostulantInfoDto;
    @Input() idEvaluation: number;
    @Input() notes: NotesEvaluationDto[];
    @Input() evaluationProficiency: EvaluationProficiencyDto[];
    @Input() evaluationRating: EvaluationRatingPostulantDto[];
    @Output() createnote = new EventEmitter();
    @Output() updateevaluation = new EventEmitter();
    @Output() updateproficiency = new EventEmitter();
    @Output() updaterating = new EventEmitter();
    @Input() tabNumber:number;

    textbutton: string = 'Aprobar y Continuar proceso';
    evaluador: string= 'jefe';

    notesobj: NotesEvaluationDto = {
        autor: '',
        dateRegister: '',
        descripcion: '',
        id: null,
        idEvaluationPostulant: null
    };

    dtoEvaluation: EvaluationPostulantDto = {
        id: null,
        approved: null,
        idEvaluation: null,
        idPostulant: null,
        state: null,
        onlySave: false
    };
    nid_profile:number;
    perfilesGerenteLiderRRHH: number[];
    perfilesJefeArea: number[];
    perfilesGerenteArea: number[];
    rutaHTMLCompetencias: SafeResourceUrl;
    constructor(private evaluationService: EvaluationPostulantService,
                private router: Router,
                private dialog: MatDialog,
                public sanitizer: DomSanitizer,
                private snack: MatSnackBar) { 
      this.rutaHTMLCompetencias = this.sanitizer.bypassSecurityTrustResourceUrl(environment.localhost + "assets/html/detalle-competencias.html");
    }

    ngOnInit() {
      const storage = JSON.parse(localStorage.getItem('GRUPOFE_USER'));
      this.nid_profile=storage.nid_profile;
      this.perfilesGerenteLiderRRHH = environment.perfilGerenteLiderRRHH;
      this.perfilesJefeArea = environment.perfilJefeArea;
      this.perfilesGerenteArea = environment.perfilGerenteArea;
    
     }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.notes && changes.notes.currentValue != undefined) {
            this.notes = changes.notes.currentValue;
        }

        if (changes.person && changes.person.currentValue != undefined) {
            this.person = changes.person.currentValue;
            this.dtoEvaluation.approved = this.person.approved;
        }
   }

    createNotes() {
        this.notesobj.autor = 'Gerente de Area';
        this.notesobj.idEvaluationPostulant = this.idEvaluation;
        this.evaluationService.createNotes(this.notesobj).subscribe(res => {
           if (res.stateCode == 200) {
              this.createnote.emit(true);
              this.notesobj.descripcion = '';
           }
        });
    }

    changeAction($event) {
        
        if ($event.value == true) {
           this.textbutton = 'Aprobar y Continuar reclutando';
        } else {
            this.textbutton = 'Terminar reclutamiento';
        }
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
        let i=0
        this.evaluationProficiency.map((e) => {
          if (e != null) {
             if (e.levelJefe == null) {
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
             if (e.sRatingjefeopportunities == "") {
                j++;
             }
    
             if (e.sRatingjefestrengths == "") {
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
        this.dtoEvaluation.state = this.dtoEvaluation.approved ? 965 : 912;;
        this.dtoEvaluation.idEvaluation = this.person.idEvaluation;
        let any = [];

        const formdata = new FormData();
        formdata.append('request', JSON.stringify(this.dtoEvaluation));
        formdata.append("multitest", JSON.stringify(any));

        this.evaluationService.updateEvaluation(formdata).subscribe(res => {
             if (res.stateCode == 200) {
                this.snack.open("Seleccionado correctamente", "OK", { duration: 4000 });
                this.updateevaluation.emit(true);
             } else {
                this.snack.open(res.messageError[0], "Error", { duration: 4000 });
             }
        })
    } 

    getDetailPath(id: number): void {
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