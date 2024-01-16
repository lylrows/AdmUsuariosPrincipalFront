import { EvaluationPostulantDocumentsDto } from "./../../../../../../data/schema/evaluation-documents";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EvaluationPostulantService } from "@app/data/service/evaluation-postulant.service";
import { NotesEvaluationDto } from "@app/data/schema/notes-evaluation";
import { PostulantInfoDto } from "./../../../../../../data/schema/Postulant/postulant";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-solicitud-documentos",
  templateUrl: "solicitud-documentos.component.html",
  styleUrls: ["solicitud-documentos.component.scss"],
})
export class SolicitudDocumentosComponent implements OnInit, OnChanges {
  @Input() person: PostulantInfoDto;
  @Input() notas: NotesEvaluationDto[];
  @Input() idEvaluation: number;
  @Input() documents: EvaluationPostulantDocumentsDto;
  @Output() createnote = new EventEmitter();
  @Output() loadfile = new EventEmitter();
  notes: NotesEvaluationDto = {
    autor: "",
    dateRegister: "",
    descripcion: "",
    id: null,
    idEvaluationPostulant: null,
  };
  constructor(
    private evaluationService: EvaluationPostulantService,
    private router: Router,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.documents && changes.documents.currentValue != undefined) {
      this.documents = changes.documents.currentValue;
    }
  }

  changeFileAntece($event) {
    var archivo = $event.target.files[0];

    if (parseInt(($event.target.files[0].size / 1024 / 1024).toFixed(1)) > 3.5) {
      this.snack.open('El tamaño máximo permitido es de 3.5mb', "Error", { duration: 4000 });
      return;
    }

    const formdata = new FormData();
    formdata.append("file", archivo);

    this.documents.idEvaluationPostulant = this.idEvaluation;
    this.documents.nombreDocumento = "antecedentes";
    this.documents.idPostulant = this.person.informationPersonal.id;
    formdata.append("request", JSON.stringify(this.documents));

    this.loadFile(formdata);
  }

  changeFileCertificado($event) {
    var archivo = $event.target.files[0];

    if (parseInt(($event.target.files[0].size / 1024 / 1024).toFixed(1)) > 3.5) {
      this.snack.open('El tamaño máximo permitido es de 3.5mb', "Error", { duration: 4000 });
      return;
    }


    const formdata = new FormData();
    formdata.append("file", archivo);

    this.documents.idEvaluationPostulant = this.idEvaluation;
    this.documents.nombreDocumento = "certificado";
    this.documents.idPostulant = this.person.informationPersonal.id;
    formdata.append("request", JSON.stringify(this.documents));

    this.loadFile(formdata);
  }

  deleteFile(name) {
     this.documents.nombreDocumento = name;
     this.evaluationService.deleteFile(this.documents).subscribe(res => {
        if (res.stateCode == 200) {
          this.snack.open("Eliminado correctamente", "OK", { duration: 4000 });
          this.loadfile.emit(true);
        }
     })
  }

  loadFile(formdata) {
    this.evaluationService.loadFiles(formdata).subscribe((res) => {
      if (res.stateCode == 200) {
        this.snack.open("Subido correctamente", "OK", { duration: 4000 });
        this.loadfile.emit(true);
      } else {
        this.snack.open(res.messageError[0], "Error", { duration: 4000 });
      }
    });
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

  getDetailPath(id: number): void {
    this.close();
    this.router.navigate(['/humanmanagement/recruitment-evaluation/',id], {
      skipLocationChange: true
    })
  }

  close(): void {
    this.dialog.closeAll();
  }
}
