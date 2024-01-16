import { MatSnackBar } from "@angular/material/snack-bar";
import { EvaluationPostulantService } from "@app/data/service/evaluation-postulant.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component, OnInit, Inject } from "@angular/core";
import { ErrorLoadedComponent } from "./error-loaded/error-loaded.component";

@Component({
  selector: "app-recruitment-load-masive",
  templateUrl: "recruitment-load-masive.component.html",
  styleUrls: ["./recruitment-load-masive.component.scss"],
})
export class RecruitmentLoadMasiveComponent implements OnInit {
  title = "";
  job: any;
  archivo: any;
  filename: any;
  dtPostulants: MatTableDataSource<any> = new MatTableDataSource([]);
  displayedColumns: string[] = [
    "postulant",
    "email",
    "dateAppliant",
    "applicationSource",
  ];
  isBumeran: boolean;
  constructor(
    private dialogRef: MatDialogRef<RecruitmentLoadMasiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private evaluationService: EvaluationPostulantService,
    private snack: MatSnackBar,
    public _dialog: MatDialog
  ) {
    this.title = this.data.title;
    this.job = this.data.job;
  }

  ngOnInit() {
    this.getPostulantsLoaded();
  }

  getPostulantsLoaded() {
    this.evaluationService.getPostulantsLoaded(this.job).subscribe((res) => {
      this.dtPostulants = res.data;
    });
  }

  changeFile(event) {
    var archivo = event.target.files[0];
    this.archivo = archivo;
    
    this.filename = this.archivo.name;
  }

  deleteFile() {
    this.archivo = null;
    this.filename = null;
  }

  close(): void {
    this.dialogRef.close(false);
  }

  loadMasive() {
    if (this.isBumeran == undefined) {
      this.snack.open("No se ha seleccionado la fuente de origen de postulantes", "Advertencia", {
        duration: 4000,
      });
      return;
    }
    if (this.archivo == null) {
      this.snack.open("No se ha adjuntado ningun archivo", "Advertencia", {
        duration: 4000,
      });
      return;
    }

    const dto = {
      isBumeran: this.isBumeran,
      job: this.job,
    };
    const formdata = new FormData();
    formdata.append("file", this.archivo);
    formdata.append("request", JSON.stringify(dto));

    this.evaluationService.loadMasive(formdata).subscribe((res) => {
      if (res.stateCode == 200) {
        this.dtPostulants = res.data;
        if (res.messageError.length == 0) {
          this.snack.open("Se ha realizado la carga correctamente", "Ok", {
            duration: 4000,
          });
        }
        if (res.messageError.length > 0) {
          if (res.messageError.length == 0) {
            this.snack.open("Se ha realizado la carga con algunas observaciones", "Ok", {
              duration: 4000,
            });
          }


          let error = res.messageError;
          let title = "Errores detectados en la carga";
          const config = new MatDialogConfig();
          config.width = "600px";
          config.height = "400px";
          config.data = {
            title,
            error,
          };

          const modal = this._dialog.open(
            ErrorLoadedComponent,
            config
          );
        }
      }
    });
  }
}
