import { environment } from './../../../../../../../../environments/environment';
import { EvaluationRatingPostulantDto } from "./../../../../../../../data/schema/evaluation-rating";
import { EvaluationProficiencyDto } from "./../../../../../../../data/schema/evaluation-proficiency";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EvaluationPostulantInternalService } from "./../../../../../../../data/service/evaluation-postulant-internal.service";
import { EvaluationPostulantDto } from "./../../../../../../../data/schema/evaluation-postulant";
import { NotesEvaluationDto } from "./../../../../../../../data/schema/notes-evaluation";
import { PostulantInternalInfoDto } from "./../../../../../../../data/schema/PostulantInternal/postulantInternal";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { EvaluationPostulantInternalLogrosDto } from "@app/data/schema/EvaluationInternal/evaluation-logros";
import { Router } from "@angular/router";
import { RecruitmentDetailDocumentComponent } from "../../../modals/recruitment-detail-document/recruitment-detail-document.component";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "app-cuarta-fase-internal",
  templateUrl: "cuarta-fase-internal.component.html",
  styleUrls: ["./cuarta-fase-internal.component.scss"],
})
export class CuartaFaseInternalComponent implements OnInit {
  @Input() person: PostulantInternalInfoDto;
  @Input() notas: NotesEvaluationDto[];
  @Input() idEvaluation: number;
  @Input() evaluationProficiencyFuture: EvaluationProficiencyDto[];
  @Input() evaluationProficiencyPresent: EvaluationProficiencyDto[];
  @Input() evaluationRating: EvaluationRatingPostulantDto[];
  @Output() createnote = new EventEmitter();
  @Output() updateevaluation = new EventEmitter();

  @Output() updateproficiencypresent = new EventEmitter();
  @Output() updateproficiencyfuture = new EventEmitter();
  @Output() updatefortalezas = new EventEmitter();

  archivoMultitest: any;
  nameArchivoMultitest: any;
  textbutton: string = "Continuar proceso";
  evaluador: string = "jefe";

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

  logros: EvaluationPostulantInternalLogrosDto = {
    id: null,
    idEvaluationPostulant: null,
    comments: "",
  };
  rutaHTMLCompetencias: SafeResourceUrl;

  constructor(
    private evaluationService: EvaluationPostulantInternalService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    public sanitizer: DomSanitizer,
    private router: Router
  ) {    
    this.rutaHTMLCompetencias = this.sanitizer.bypassSecurityTrustResourceUrl(environment.localhost + "assets/html/detalle-competencias.html");
  }

  ngOnInit() {
    this.getLogros();
  }

  changeAction($event) {
    if ($event.value == true) {
      this.textbutton = "Continuar proceso";
    } else {
      this.textbutton = "Terminar proceso";
    }
  }

  createNotes() {
    this.notes.autor = "Jefe";
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

  updateLogros() {
    this.logros.idEvaluationPostulant = this.idEvaluation;
    this.evaluationService
      .updateEvaluationLogros(this.logros)
      .subscribe((res) => {
        if (res.stateCode == 200) {
          this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
          this.getLogros();
        } else {
          this.snack.open(res.messageError[0], "Error", { duration: 4000 });
        }
      });
  }

  getLogros() {
    this.evaluationService
      .getEvaluationLogros(this.idEvaluation)
      .subscribe((res) => {
        this.logros = res.data;
        if (this.logros == null) {
          this.logros = {
            id: null,
            idEvaluationPostulant: null,
            comments: "",
          };
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
    b64Data = b64Data.replace(/\s/g, ""); 
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
    this.dtoEvaluation.approved = true;
    this.updateEvaluation();
  }

  rejectEvaluation() {
    this.dtoEvaluation.approved = false;
    this.updateEvaluation();
  }

  updateEvaluation() {
    let i = 0;
    this.evaluationProficiencyFuture.map((e) => {
      if (e != null) {
        
        if (e.levelJefe == null) {
          i++;
        }
      }
    });

    if (i > 0) {
      this.snack.open(
        "Tiene que completar la evaluación de competencias futuras",
        "Validación",
        { duration: 4000 }
      );
      return;
    }

    let m = 0;
    this.evaluationProficiencyPresent.map((e) => {
      if (e != null) {
        
        if (e.levelJefe == null) {
          m++;
        }
      }
    });

    if (m > 0) {
      this.snack.open(
        "Tiene que completar la evaluación de competencias de cargo actual",
        "Validación",
        { duration: 4000 }
      );
      return;
    }

    let j = 0;
    this.evaluationRating.map((e) => {
      if (e != null) {
        
        if (e.sRatingjefeopportunities == null) {
          j++;
        }

        if (e.sRatingjefestrengths == null) {
          j++;
        }
      }
    });

    if (j > 0) {
      this.snack.open(
        "Tiene que completar la evaluación de fortalezas",
        "Validación",
        { duration: 4000 }
      );
      return;
    }

    this.dtoEvaluation.id = this.idEvaluation;
    this.dtoEvaluation.idPostulant = this.person.informationPersonal.nid_person;
    this.dtoEvaluation.state = this.dtoEvaluation.approved ? 965 : 912;
    this.dtoEvaluation.idEvaluation = this.person.idEvaluation;
    let any = [];

    const formdata = new FormData();
    formdata.append("request", JSON.stringify(this.dtoEvaluation));
    formdata.append("multitest", JSON.stringify(any));

    this.evaluationService.updateEvaluation(formdata).subscribe((res) => {
      if (res.stateCode == 200) {
        this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
        this.updateevaluation.emit(true);
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
