import { egretAnimations } from "@shared/animations/egret-animations";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ValidationErrors,
} from "@angular/forms";
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AppConfirmService } from "@app/shared/services/app-confirm/app-confirm.service";
import { EmployeeQueryFilter } from "@app/data/schema/employee/EmployeQueryFilter";
import { SalaryBandService } from "@app/data/service/salaryband.service";

export interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: "app-dialog-band-box",
  templateUrl: "./dialog-band-box.component.html",
  styleUrls: ["./dialog-band-box.component.scss"],
  animations: egretAnimations,
})
export class DialogBandBoxComponent implements OnInit {
  public itemForm: FormGroup;
  public progress: number;
  public message: string;
  selectedFile: any;
  displayFileName = "";

  @ViewChild("fileInput")
  fileInput: ElementRef;
  imageURL = "";
  idContact = 0;
  archivoCapturado: any;
  employees: any[] = [];

  employeeFilter = <EmployeeQueryFilter>{
    nid_company: 0,
    nid_position: 0,
    sidentification: "",
    sfullname: "",
  };
  selectedEmployee = 0;
  groups = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogBandBoxComponent>,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    public confirmService: AppConfirmService,
    private salaryBandService: SalaryBandService
  ) {}

  ngOnInit() {
    this.getGroups();

    this.buildItemForm(this.data.payload);
  }

  getGroups() {
    this.salaryBandService.getGroupCombo().subscribe((resp) => {
      this.groups = resp.data;
    });
  }

  buildItemForm(item) {
    
    this.itemForm = this.fb.group({
      idBandBox: new FormControl(item.idBandBox || 0),
      // idgroup: new FormControl(item.idGroup || 0, [Validators.required]),
      points: new FormControl(item.points || "", [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('[0-9-. ]*')
      ]),
      namegroup: new FormControl(item.nameGroup || "", [
        Validators.required,
        Validators.maxLength(100)
      ]),
      namecategory: new FormControl(item.categoryName || "", [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern('[A-Za-z0-9ÁÉÍÓÚáéíóúñÑ ]*')
      ]),
      


      minimunpoint: new FormControl(item.minimunPoint || 0, [
        Validators.required,
      ]),
      middlepoint: new FormControl(item.middlePoint || 0, [
        Validators.required,
      ]),
      maximunpoint: new FormControl(item.maximunPoint || 0, [
        Validators.required,
      ]),
      bandwidth: new FormControl(item.bandhWidth || 0, [Validators.required]),
      active: [item.active || true],
    });
  }

  submit() {
    let id = this.itemForm.get("idBandBox").value;
    let idgroup = 0;//this.itemForm.get("idgroup").value;


    this.save();
    
    
  }
  save(){
    let bandwith = this.itemForm.get("bandwidth").value;
    let minimunpoint = this.itemForm.get("minimunpoint").value;
    let middlepoint = this.itemForm.get("middlepoint").value;
    let maximunpoint = this.itemForm.get("maximunpoint").value;

    this.itemForm.get("bandwidth").setValue(parseFloat(bandwith.toString()));
    this.itemForm
      .get("minimunpoint")
      .setValue(parseFloat(minimunpoint.toString()));
    this.itemForm
      .get("middlepoint")
      .setValue(parseFloat(middlepoint.toString()));
    this.itemForm
      .get("maximunpoint")
      .setValue(parseFloat(maximunpoint.toString()));

    this.salaryBandService.savesalaryband(this.itemForm.value).subscribe(
      (data) => {
        if (data !== null && data !== undefined) {
          if (data.stateCode !== 200) {
            this.snack.open(data.messageError[0], "OK", { duration: 4000 });

            return;
          }

          this.snack.open(data.messageError[0], "OK", { duration: 4000 });

          this.dialogRef.close();
        } else {
          this.snack.open("Ocurrió un error", "OK", { duration: 4000 });
        }
      },
      (err) => {
        this.snack.open(err.message, "OK", { duration: 4000 });
      }
    );
  }

  getFormValidationErrors() {
    Object.keys(this.itemForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.itemForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
         console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

}
