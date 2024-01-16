import { PostulantInfoDto } from './../../../../../../data/schema/Postulant/postulant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationPostulantService } from '@app/data/service/evaluation-postulant.service';
import { EvaluationRatingPostulantDto } from './../../../../../../data/schema/evaluation-rating';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from 'environments/environment';
@Component({
    selector: 'app-evaluation-rating',
    templateUrl: 'evaluation-rating.component.html',
    styleUrls: ['evaluation-rating.component.scss']
})

export class EvaluationRatingComponent implements OnInit , OnChanges {
    @Input() evaluationRating: EvaluationRatingPostulantDto[];
    @Input() evaluador;
    @Input() person: PostulantInfoDto;
    @Output() updateevaluation = new EventEmitter();
    nid_profile:number;
    perfilesGerenteLiderRRHH: number[];
    perfilesJefeArea: number[];
    perfilesGerenteArea: number[];
    rowEvaluation: any = null;
    
    constructor(private evaluacionService: EvaluationPostulantService, private snack: MatSnackBar) { }

    ngOnInit() { 
      const storage= JSON.parse(localStorage.getItem("GRUPOFE_USER"));
      this.nid_profile=storage.nid_profile;
      this.perfilesGerenteLiderRRHH = environment.perfilGerenteLiderRRHH;
      this.perfilesJefeArea = environment.perfilJefeArea;
      this.perfilesGerenteArea = environment.perfilGerenteArea;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.evaluationRating && changes.evaluationRating.currentValue != undefined) {
            this.evaluationRating = changes.evaluationRating.currentValue;
            
        }
    }

    onRowEditSave(row) {
        this.evaluacionService.updateEvaluationRating(row).subscribe(res => {
             if (res.stateCode == 200) {
                this.updateevaluation.emit(true);
                this.snack.open("Calificado correctamente", "OK", { duration: 4000 });
             } else {
                this.snack.open(res.messageError[0], "Error", { duration: 4000 });
             }
        })
    }

    onRowEditInit(evaluation) {
        this.rowEvaluation = Object.assign({}, evaluation);
     }
  
     onRowEditCancel(evaluation, ri) {
        if(this.rowEvaluation != null) {
           evaluation.sRatingrrhhstrengths = this.rowEvaluation.sRatingrrhhstrengths; 
           evaluation.sRatingrrhhopportunities = this.rowEvaluation.sRatingrrhhopportunities; 
           evaluation.sRatingclientstrengths = this.rowEvaluation.sRatingclientstrengths; 
           evaluation.sRatingclientopportunities = this.rowEvaluation.sRatingclientopportunities; 
           evaluation.sRatingjefestrengths = this.rowEvaluation.sRatingjefestrengths; 
           evaluation.sRatingjefeopportunities = this.rowEvaluation.sRatingjefeopportunities; 
        }
     }
}