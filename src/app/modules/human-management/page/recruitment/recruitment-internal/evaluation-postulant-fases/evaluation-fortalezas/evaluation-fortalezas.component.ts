import { PostulantInternalInfoDto } from './../../../../../../../data/schema/PostulantInternal/postulantInternal';
import { EvaluationPostulantInternalService } from './../../../../../../../data/service/evaluation-postulant-internal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationRatingPostulantDto } from './../../../../../../../data/schema/evaluation-rating';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-evalution-fortalezas',
    templateUrl: 'evaluation-fortalezas.component.html',
    styleUrls: ['./evaluation-fortalezas.component.scss']
})

export class EvaluationFortalezasComponent implements OnInit {
    @Input() evaluationRating: EvaluationRatingPostulantDto[];
    @Input() evaluador;
    @Output() updateevaluation = new EventEmitter();
    @Input() person: PostulantInternalInfoDto;
    rowEvaluation: any = null;

    constructor(private evaluacionService: EvaluationPostulantInternalService, private snack: MatSnackBar) { }

    ngOnInit() { } 

    onRowEditInit(evaluation) {
        this.rowEvaluation = Object.assign({}, evaluation);
     }
  
     onRowEditCancel(evaluation, ri) {
        if(this.rowEvaluation != null) {
           evaluation.sRatingrrhhstrengths = this.rowEvaluation.sRatingrrhhstrengths; 
           evaluation.sRatingjefestrengths = this.rowEvaluation.sRatingjefestrengths; 
           evaluation.sRatingrrhhopportunities = this.rowEvaluation.sRatingrrhhopportunities; 
           evaluation.sRatingjefeopportunities = this.rowEvaluation.sRatingjefeopportunities; 
        }
     }

    onRowEditSave(row) {
        this.evaluacionService.updateEvaluationfortalezasIntern(row).subscribe(res => {
             if (res.stateCode == 200) {
                this.updateevaluation.emit(true);
                this.snack.open("Calificado correctamente", "OK", { duration: 4000 });
             } else {
                this.snack.open(res.messageError[0], "Error", { duration: 4000 });
             }
        })
    }
}