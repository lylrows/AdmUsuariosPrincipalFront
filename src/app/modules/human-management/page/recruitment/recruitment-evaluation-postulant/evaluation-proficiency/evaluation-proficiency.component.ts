import { PostulantInfoDto } from './../../../../../../data/schema/Postulant/postulant';
import { SharedService } from './../../../../../../data/service/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationProficiencyDto } from './../../../../../../data/schema/evaluation-proficiency';
import { Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { EvaluationPostulantService } from '@app/data/service/evaluation-postulant.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-evaluation-proficiency',
    templateUrl: 'evaluation-proficiency.component.html',
    styleUrls: ['evaluation-proficiency.component.scss']
})

export class EvaluationProficiencyComponent implements OnInit, OnChanges {
    @Input() evaluationProficiency: EvaluationProficiencyDto[];
    @Input() evaluador;
    @Input() person: PostulantInfoDto;
    @Output() updateevaluation = new EventEmitter();
    listProficiency:any[] = [];
    rowGroupMetadata: any; 
    index = 0; 
    nid_profile: number = 0;
    perfilesGerenteLiderRRHH: number[];
    perfilesJefeArea: number[];
    perfilesGerenteArea: number[];
    rowEvaluation: any = null;

    constructor(private evaluacionService: EvaluationPostulantService, private snack: MatSnackBar, private sharedService: SharedService) {
       this.loadProficiency();
       const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
        this.nid_profile = storage.nid_profile;
        this.perfilesGerenteLiderRRHH = environment.perfilGerenteLiderRRHH;
        this.perfilesJefeArea = environment.perfilJefeArea;
        this.perfilesGerenteArea = environment.perfilGerenteArea;
      
        
     }


    ngOnChanges(changes: SimpleChanges): void {
         if (changes.evaluador && changes.evaluador.currentValue != undefined){
         }

         if (changes.evaluationProficiency && changes.evaluationProficiency.currentValue != undefined){
            this.evaluationProficiency = changes.evaluationProficiency.currentValue;
         }
    }
    ngOnInit() {
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
           expectative: 1,
           fullNamePostulant: this.person.informationPersonal.firstName + ' ' + this.person.informationPersonal.lastName,
           id: null,
           idEvaluation: this.person.idEvaluation,
           idPostulant: this.person.informationPersonal.id,
           idProficiency: $event.value,
           levelClient: null,
           levelJefe: null,
           levelRRHH: null,
           testRRHH: null,
           comentarioRRHH: null,
           proficiency: proficiency,
           rowGroup: null,
           required: required
        }

        var exist = this.evaluationProficiency.filter(x => x.idProficiency == $event.value);
        if (exist.length > 0) {
         this.snack.open("Ya se encuentra añadida la competencia", "Advertencia", { duration: 4000 });
         return;
        }

        this.onRowEditSave(obj);
     }

    onRowEditSave(row) {
        
        if(row.expectative == null || row.expectative == 0) {
         this.snack.open("Debe ingresar un valor para la expectativa", "OK", { duration: 4000 });
         return;
        }
        if(row.levelRRHH != null) row.levelRRHH = Number(row.levelRRHH);
        if(row.levelClient != null) row.levelClient = Number(row.levelClient);
        if(row.levelJefe != null) row.levelJefe = Number(row.levelJefe);
        this.evaluacionService.updateEvaluationProficiency(row).subscribe(res => {
             if (res.stateCode == 200) {
                this.updateevaluation.emit(true);
                this.snack.open("Calificado correctamente", "OK", { duration: 4000 });
             } else {
                this.snack.open(res.messageError[0], "Error", { duration: 4000 });
             }
        })
    }

    onRowDeleteSave(row) {
      
      if(row.levelRRHH != null) row.levelRRHH = Number(row.levelRRHH);
      if(row.levelClient != null) row.levelClient = Number(row.levelClient);
      if(row.levelJefe != null) row.levelJefe = Number(row.levelJefe);
      this.evaluacionService.deleteEvaluationProficiency(row).subscribe(res => {
           if (res.stateCode == 200) {
              this.updateevaluation.emit(true);
              this.snack.open("Ha sido eliminado correctamente.", "OK", { duration: 4000 });
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
         evaluation.expectative = this.rowEvaluation.expectative; 
         evaluation.levelRRHH = this.rowEvaluation.levelRRHH; 
         evaluation.levelClient = this.rowEvaluation.levelClient; 
         evaluation.levelJefe = this.rowEvaluation.levelJefe; 
      }
   }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};
        if (this.evaluationProficiency) {
           for (let i = 0; i < this.evaluationProficiency.length; i++) {
             let rowData = this.evaluationProficiency[i];
             let rowGroup = rowData.rowGroup;			
             if (i === 0) {
                this.rowGroupMetadata[rowGroup] = { index: 0, size: 1 };
             }
             else {
                let previousRowData = this.evaluationProficiency[i - 1];
                let previousRowGroup = previousRowData.rowGroup;
                if (rowGroup === previousRowGroup)
                    this.rowGroupMetadata[rowGroup].size++;
                else
                  this.rowGroupMetadata[rowGroup] = { index: i, size: 1 };
             }
          }
           }

           
      }
 valideKey(evt, valor) {
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