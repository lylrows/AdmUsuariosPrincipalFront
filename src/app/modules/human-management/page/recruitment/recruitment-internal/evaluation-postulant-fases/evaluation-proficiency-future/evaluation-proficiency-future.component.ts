import { PostulantInternalInfoDto } from './../../../../../../../data/schema/PostulantInternal/postulantInternal';
import { SharedService } from './../../../../../../../data/service/shared.service';
import { EvaluationPostulantInternalService } from './../../../../../../../data/service/evaluation-postulant-internal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationProficiencyDto } from './../../../../../../../data/schema/evaluation-proficiency';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-evaluation-proficiency-future',
    templateUrl: 'evaluation-proficiency-future.component.html',
    styleUrls: ['./evaluation-proficiency-future.component.scss']
})

export class EvaluationProficiencyFutureComponent implements OnInit {
    @Input() person: PostulantInternalInfoDto;
    @Input() evaluationProficiency: EvaluationProficiencyDto[];
    @Input() evaluador;
    @Output() updateevaluation = new EventEmitter();
    listProficiency:any[] = [];
    rowEvaluation: any = null;
    constructor(private evaluacionService: EvaluationPostulantInternalService, private snack: MatSnackBar, private sharedService: SharedService) { }

    ngOnInit() { 
        this.loadProficiency();
    }

    loadProficiency() {
        this.sharedService.getAll().subscribe(res => {
           this.listProficiency = res.data;
        })
   }

   changeCompetencia($event) {
    let proficiency = this.listProficiency.find(x => x.code == $event.value).description;
    let required = this.listProficiency.find(x => x.code == $event.value).required;
    const obj: EvaluationProficiencyDto = {
       expectative: null,
       fullNamePostulant: this.person.informationPersonal.sfirstname + ' ' + this.person.informationPersonal.slastname,
       id: null,
       idEvaluation: this.person.idEvaluation,
       idPostulant: this.person.informationPersonal.nid_person,
       idProficiency: $event.value,
       levelClient: null,
       levelJefe: null,
       testRRHH: null,
       comentarioRRHH: null,
       levelRRHH: null,
       proficiency: proficiency,
       rowGroup: null,
       flag: 1,
       required: required
    }

    var exist = this.evaluationProficiency.filter(x => x.idProficiency == $event.value);
    if (exist.length > 0) {
     this.snack.open("Ya se encuentra añadida la competencia", "Advertencia", { duration: 4000 });
     return;
    }

    this.save(obj);
 }

    onRowEditSave(row) {
        if (row.levelJefe != null) row.levelJefe = Number(row.levelJefe);
        if (row.levelRRHH != null) row.levelRRHH = Number(row.levelRRHH);
        if (row.expectative != null) row.expectative = Number(row.expectative);
        if (row.testRRHH != null) row.testRRHH = Number(row.testRRHH);
        this.evaluacionService.updateEvaluationProficiencyIntern(row).subscribe(res => {
             if (res.stateCode == 200) {
                this.updateevaluation.emit(true);
                this.snack.open("Calificado correctamente", "OK", { duration: 4000 });
             } else {
                this.snack.open(res.messageError[0], "Error", { duration: 4000 });
             }
        })
    }

    save(row) {
        this.evaluacionService.updateEvaluationProficiencyIntern(row).subscribe(res => {
            if (res.stateCode == 200) {
               this.updateevaluation.emit(true);
               this.snack.open("Agregado correctamente", "OK", { duration: 4000 });
            } else {
               this.snack.open(res.messageError[0], "Error", { duration: 4000 });
            }
       })
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

  onRowEditInit(evaluation) {
    this.rowEvaluation = Object.assign({}, evaluation);
  }

  onRowEditCancel(evaluation, ri) {
    if(this.rowEvaluation != null) {
       evaluation.expectative = this.rowEvaluation.expectative; 
       evaluation.levelRRHH = this.rowEvaluation.levelRRHH; 
       evaluation.testRRHH = this.rowEvaluation.testRRHH; 
       evaluation.comentarioRRHH = this.rowEvaluation.comentarioRRHH; 
       evaluation.levelJefe = this.rowEvaluation.levelJefe; 
    }
 }

 valideKeyCompetencia(evt, valor) {
   var code = evt.which ? evt.which : evt.keyCode;

   if (code == 8) {        
       return true;
   } 
   
   if (valor > 4) return false;
   if (valor != null) {
      if (valor.toString().length > 0) return false;
   }


   if (code >= 48 && code <= 52) {        
       return true;
   } else {        
       return false;
   }
  }
}