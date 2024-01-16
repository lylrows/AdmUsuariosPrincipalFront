import { EvaluationPostulantInfoCurriculumDto } from "./../../../../../../../data/schema/EvaluationInternal/evaluation-curriculum";
import { EvaluationPostulantPositionDto } from "./../../../../../../../data/schema/EvaluationInternal/evaluation-position";
import { PostulantInternalInfoDto } from "./../../../../../../../data/schema/PostulantInternal/postulantInternal";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EvaluationPostulantInternalService } from "./../../../../../../../data/service/evaluation-postulant-internal.service";
import { EvaluationPostulantDto } from "./../../../../../../../data/schema/evaluation-postulant";
import { NotesEvaluationDto } from "./../../../../../../../data/schema/notes-evaluation";
import { PostulantInfoDto } from "./../../../../../../../data/schema/Postulant/postulant";
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-primera-fase-internal",
  templateUrl: "primera-fase-internal.component.html",
  styleUrls: ["./primera-fase-internal.component.scss"],
})
export class PrimeraFaseInternalComponent implements OnInit, OnChanges {
  @Input() person: PostulantInternalInfoDto;
  @Input() notas: NotesEvaluationDto[];
  @Input() idEvaluation: number;
  @Output() createnote = new EventEmitter();
  @Output() updateevaluation = new EventEmitter();
  dtoposition: EvaluationPostulantPositionDto;
  dtoevaluationcv: EvaluationPostulantInfoCurriculumDto[];

  archivoMultitest: any;
  nameArchivoMultitest: any;
  textbutton: string = "Continuar proceso";

  dtoEvaluation: EvaluationPostulantDto = {
    id: null,
    approved: null,
    idEvaluation: null,
    idPostulant: null,
    state: null,
    onlySave: false
  };

  notes: NotesEvaluationDto = {
    autor: "",
    dateRegister: "",
    descripcion: "",
    id: null,
    idEvaluationPostulant: null,
  };
  constructor(
    private evaluationService: EvaluationPostulantInternalService,
    private router: Router,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}


  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.person && changes.person.currentValue != undefined) {
      this.dtoEvaluation.approved = this.person.approved;
      if (this.person.fileMultitest != null) {
        this.archivoMultitest = this.person.fileMultitest.file;
        this.nameArchivoMultitest = this.person.fileMultitest.nameFile;
      }
    }

    if (
      changes.idEvaluation &&
      changes.idEvaluation.currentValue != undefined
    ) {
      this.getEvaluationPosition();
      this.getEvaluationCurriculum();
    }
  }

  changeFile2(event) {}

  getEvaluationPosition() {
    this.evaluationService
      .getEvaluationPosition(this.idEvaluation)
      .subscribe((res) => {
        if (res.data != null) {
          this.dtoposition = res.data;
          this.dtoposition.positionsCompany = res.dataDetail;
        } else {
          this.dtoposition = {
            actualPosition: "",
            area: "",
            company: "",
            dimissionDate: null,
            evaluated: "",
            id: null,
            idEvaluationPostulant: null,
            positionsInCompany: null,
            postulatedPosition: null,
            timeInOffice: null,
            positionsCompany: []
          };
        }
      });
  }
  getEvaluationCurriculum() {
    this.evaluationService
      .getEvaluationCurriculum(this.idEvaluation)
      .subscribe((res) => {
        this.dtoevaluationcv = res.data;
      });
  }

  changeAction($event) {
    if ($event.value == true) {
      this.textbutton = "Continuar proceso";
    } else {
      this.textbutton = "Terminar proceso";
    }
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
    this.dtoevaluationcv.map((e) => {
      if (e != null) {
        
         if (e.espectative == "") {
            i++;
         }

         if (e.idValidation == null) {
            i++;
         }

         if (e.comments == "") {
            i++;
         }
      }
    });

    if (i > 0) {
      this.snack.open("Debe de completar la Evaluación del Perfil Requerido", "Validación", { duration: 4000 });
      return;
    }

    this.dtoEvaluation.id = this.idEvaluation;
    this.dtoEvaluation.idPostulant = this.person.informationPersonal.nid_person;
    this.dtoEvaluation.state = this.dtoEvaluation.approved ? 909 : 912;
    this.dtoEvaluation.idEvaluation = this.person.idEvaluation;
    let any = [];

    const formdata = new FormData();
    formdata.append("request", JSON.stringify(this.dtoEvaluation));
    formdata.append("multitest", JSON.stringify(any));

    this.evaluationService.updateEvaluation(formdata).subscribe((res) => {
      if (res.stateCode == 200) {
        this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
        this.updateevaluation.emit(false);
      } else {
        this.snack.open(res.messageError[0], "Error", { duration: 4000 });
      }
    });
  }

  getDetailPath(id: number): void {
    this.close();
    this.router.navigate(['/humanmanagement/evaluation-postulants/',id], {
      skipLocationChange: true
    })
  }

  close(): void {
    this.dialog.closeAll();
  }
}
