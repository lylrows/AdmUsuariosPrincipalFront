import { environment } from './../../../../../../../../environments/environment';
import { EvaluationProficiencyDto } from "./../../../../../../../data/schema/evaluation-proficiency";
import { EvaluationRatingPostulantDto } from "./../../../../../../../data/schema/evaluation-rating";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EvaluationPostulantInternalService } from "./../../../../../../../data/service/evaluation-postulant-internal.service";
import { EvaluationPostulantDto } from "./../../../../../../../data/schema/evaluation-postulant";
import { NotesEvaluationDto } from "./../../../../../../../data/schema/notes-evaluation";
import { PostulantInternalInfoDto } from "./../../../../../../../data/schema/PostulantInternal/postulantInternal";
import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { RecruitmentDetailDocumentComponent } from "../../../modals/recruitment-detail-document/recruitment-detail-document.component";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "app-tercera-fase-internal",
  templateUrl: "tercera-fase-internal.component.html",
  styleUrls: ["./tercera-fase-internal.component.scss"],
})
export class TerceraFaseInternalComponent implements OnInit {
  @Input() person: PostulantInternalInfoDto;
  @Input() notas: NotesEvaluationDto[];
  @Input() idEvaluation: number;
  @Input() evaluationProficiency: EvaluationProficiencyDto[];
  @Input() evaluationRating: EvaluationRatingPostulantDto[];
  @Input() evaluationProficiencyPresent: EvaluationProficiencyDto[];
  @Output() createnote = new EventEmitter();
  @Output() updateevaluation = new EventEmitter();
  @Output() updateproficiency = new EventEmitter();
  @Output() updatefortalezas = new EventEmitter();
  @Output() updateproficiencypresent = new EventEmitter();
  archivoMultitest: any;
  nameArchivoMultitest: any;
  textbutton: string = "Continuar proceso";
  evaluador: string = "rrhh";

  dtoEvaluation: EvaluationPostulantDto = {
    id: null,
    approved: null,
    idEvaluation: null,
    idPostulant: null,
    state: null,
    onlySave: false,
  };

  notes: NotesEvaluationDto = {
    autor: "",
    dateRegister: "",
    descripcion: "",
    id: null,
    idEvaluationPostulant: null,
  };
  rutaHTMLCompetencias: SafeResourceUrl;

  constructor(
    private evaluationService: EvaluationPostulantInternalService,
    private router: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    public sanitizer: DomSanitizer
  ) {    
    this.rutaHTMLCompetencias = this.sanitizer.bypassSecurityTrustResourceUrl(environment.localhost + "assets/html/detalle-competencias.html");
  }

  ngOnInit() {}

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
        this.notes.descripcion = "";
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

  aprovedEvaluation() {
    //validar competencias presentes:
    var _required = this.evaluationProficiencyPresent.filter(x => x.required == true && x.expectative > 0 && x.levelRRHH > 0);
    if (_required.length < 3) {
      this.snack.open("Debe completar los datos de las Competencias Actuales obligatorios.", "Error", { duration: 4000 });
      return;
    }

    //validar competencias presentes:
    var _required = this.evaluationProficiency.filter(x => x.required == true && x.expectative > 0 && x.levelRRHH > 0);
    if (_required.length < 3) {
      this.snack.open("Debe completar los datos de las competencias Futuras obligatorias.", "Error", { duration: 4000 });
      return;
    }

    this.dtoEvaluation.approved = true;
    this.updateEvaluation();
  }

  rejectEvaluation() {
    this.dtoEvaluation.approved = false;
    this.updateEvaluation();
  }

  updateEvaluation() {
    let i = 0;
    this.evaluationProficiency.map((e) => {
      if (e != null) {
        
        if (e.levelRRHH == null) {
          i++;
        }
      }
    });

    if (i > 0) {
      this.snack.open(
        "Debe de completar la Evaluación de Competencias",
        "Validación",
        { duration: 4000 }
      );
      return;
    }

    let j = 0;
    this.evaluationRating.map((e) => {
      if (e != null) {
        
        if (
          e.sRatingrrhhopportunities == "" ||
          e.sRatingrrhhopportunities == null
        ) {
          j++;
        }

        if (e.sRatingrrhhstrengths == "" || e.sRatingrrhhstrengths == null) {
          j++;
        }
      }
    });

    if (j > 0) {
      this.snack.open(
        "Debe de completar la Evaluación de Fortalezas",
        "Validación",
        { duration: 4000 }
      );
      return;
    }

    this.dtoEvaluation.id = this.idEvaluation;
    this.dtoEvaluation.idPostulant = this.person.informationPersonal.nid_person;
    this.dtoEvaluation.state = this.dtoEvaluation.approved ? 956 : 912;
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

  openModal() {    
    window.open('/assets/html/detalle-competencias.pdf', '_blank');
  }

  close(): void {
    this.dialog.closeAll();
  }
}