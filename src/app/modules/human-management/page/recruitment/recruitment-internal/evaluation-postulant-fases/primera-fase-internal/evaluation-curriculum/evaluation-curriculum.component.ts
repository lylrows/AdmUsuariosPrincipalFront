import { PostulantInternalInfoDto } from './../../../../../../../../data/schema/PostulantInternal/postulantInternal';
import { MastertableService } from '@app/data/service/mastertable.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { EvaluationPostulantInternalService } from "./../../../../../../../../data/service/evaluation-postulant-internal.service";
import { Component, Input, OnInit, EventEmitter, Output } from "@angular/core";
import { EvaluationPostulantInfoCurriculumDto } from "@app/data/schema/EvaluationInternal/evaluation-curriculum";

@Component({
  selector: "app-evaluation-curriculum",
  templateUrl: "evaluation-curriculum.component.html",
  styleUrls: ["./evaluation-curriculum.component.scss"],
})
export class EvaluationCurriculumComponent implements OnInit {
  @Input() lstInfo: EvaluationPostulantInfoCurriculumDto[];
  @Output() sendaction = new EventEmitter();
  lstLevel: any[] = [];
  @Input() person: PostulantInternalInfoDto;
  rowEvaluation: any = null;

  constructor(
    private evaluationService: EvaluationPostulantInternalService,
    private snack: MatSnackBar,
    private masterTableService: MastertableService
  ) {} 

  ngOnInit() {
      this.loadLevel();
  }

  onRowEditSave(event) {
    event.idValidation = Number(event.idValidation);
    this.evaluationService
      .updateEvaluationCurriculum(event)
      .subscribe((res) => {
        if (res.stateCode == 200) {
          this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
          this.sendaction.emit(true);
        } else {
          this.snack.open(res.messageError[0], "Error", { duration: 4000 });
        }
      });
  }

  loadLevel () {
  this.masterTableService.getByIdFather(961).subscribe(res => {
        this.lstLevel = res;
  })
  }

  onRowEditInit(evaluation) {
    this.rowEvaluation = Object.assign({}, evaluation);
 }

 onRowEditCancel(evaluation, ri) {
    if(this.rowEvaluation != null) {
       evaluation.espectative = this.rowEvaluation.espectative; 
       evaluation.idValidation = this.rowEvaluation.idValidation; 
       evaluation.comments = this.rowEvaluation.comments; 
    }
 }

}
