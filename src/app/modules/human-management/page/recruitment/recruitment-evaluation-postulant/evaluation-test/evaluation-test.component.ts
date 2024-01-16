import { PostulantInfoDto } from './../../../../../../data/schema/Postulant/postulant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationPostulantService } from '@app/data/service/evaluation-postulant.service';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { EvaluationExternTestDto } from '@app/data/schema/evaluation-test';
import { environment } from 'environments/environment';
@Component({
    selector: 'app-evaluation-test',
    templateUrl: 'evaluation-test.component.html',
    styleUrls: ['./evaluation-test.component.scss']
})

export class EvaluationTestComponent implements OnInit, AfterViewChecked {
    @ViewChild('dt') dt;
    @Input() list: EvaluationExternTestDto[];
    @Input() evaluador;
    @Input() idEvaluation;
    @Output() updateevaluation = new EventEmitter();
    @Input() person: PostulantInfoDto; 
    nid_profile:number;
    perfilesGerenteLiderRRHH: number[];
    perfilesJefeArea: number[];
    perfilesGerenteArea: number[];
    filaAgregada: boolean = false;
    rowEvaluation: any = null;

    constructor(private evaluacionService: EvaluationPostulantService, private snack: MatSnackBar) { }

    ngOnInit() {
        const storage= JSON.parse(localStorage.getItem("GRUPOFE_USER"));
        this.nid_profile=storage.nid_profile;
        this.perfilesGerenteLiderRRHH = environment.perfilGerenteLiderRRHH;
        this.perfilesJefeArea = environment.perfilJefeArea;
        this.perfilesGerenteArea = environment.perfilGerenteArea;
        if (this.list == undefined) {
            this.list = [];   
        }
        
     }


    onRowEditSave(row) {
        this.evaluacionService.createEvaluationTest(row).subscribe(res => {
             if (res.stateCode == 200) {
                this.updateevaluation.emit(true);
                this.snack.open("Actualizado correctamente", "OK", { duration: 4000 });
             } else {
                this.snack.open(res.messageError[0], "Error", { duration: 4000 });
             }
        })
    }

    addRow() {
        
         const obj: EvaluationExternTestDto = {
             id: null,
             idEvaluationPostulant: this.idEvaluation, 
             score: '',
             test: '',
             expectativa: '',
             fullNamePostulant: this.person.informationPersonal.firstName + ' ' + this.person.informationPersonal.lastName
         };
         this.list.push(obj);
         this.filaAgregada = true;
    }

    onRowDeleteSave(row, index) {
        this.evaluacionService.deleteEvaluationTest(row).subscribe(res => {
             if (res.stateCode == 200) {
                this.updateevaluation.emit(true);
                this.snack.open("Eliminado correctamente", "OK", { duration: 4000 });
             } else {
                this.snack.open(res.messageError[0], "Error", { duration: 4000 });
             }
        });
        this.list.splice(index, 1);
    }

    ngAfterViewChecked() {
        if(this.filaAgregada) {
            const _cantidad = this.list.length;
            let  _element = <HTMLElement>document.querySelectorAll('.init-edit')[_cantidad - 1];
            _element.click();
            this.filaAgregada = false;
        }
    }

    onRowEditInit(evaluation) {
        this.rowEvaluation = Object.assign({}, evaluation);
     }
  
     onRowEditCancel(evaluation, ri) {
        if(this.rowEvaluation != null) {
           evaluation.test = this.rowEvaluation.test; 
           evaluation.score = this.rowEvaluation.score; 
           evaluation.expectativa = this.rowEvaluation.expectativa; 
        }
     }
}