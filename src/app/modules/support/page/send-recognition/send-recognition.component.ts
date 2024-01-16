import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EmployeeService } from "@app/data/service/employee.service";
import { RecognitionService } from "@app/data/service/recognition.service";
import { RecruitMentPersonnelService } from "@app/data/service/recruitment-personnel.service";
import { LocalStoreService } from "@app/shared/services/local-store.service";

@Component({
  selector: "app-send-recognition",
  templateUrl: "./send-recognition.component.html",
  styleUrls: ["./send-recognition.component.scss"],
})
export class SendRecognitionComponent implements OnInit {
  public itemForm: FormGroup;
  employees: any[] = [];
  employeesSelected: any[] = [];
  APP_USER = "GRUPOFE_USER";

  constructor(
    public dialogRef: MatDialogRef<SendRecognitionComponent>,
    private fb: FormBuilder,
    private _serviceEmployee: EmployeeService,
    private ls: LocalStoreService,
    private _recognitionService: RecognitionService,
    private snack: MatSnackBar,
    private _service: RecruitMentPersonnelService
  ) {}

  ngOnInit(): void {
    this.getEmployee();
    this.buildItemForm();
  }

  getUser() {
    return this.ls.getItem(this.APP_USER);
  }

  buildItemForm() {
    const niduser: number = parseInt(this.getUser().id);

    this.itemForm = this.fb.group({
      nid_person: new FormControl("", [Validators.required]),
      nid_user: [niduser],
      stitle: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
      ]),
      sdescription: new FormControl("", [
        Validators.required,
        Validators.maxLength(200),
      ]),
      sicon: new FormControl("", [Validators.required]),
    });
  }

  getEmployee(): void {
    this._serviceEmployee.getAllNoPagination().subscribe((resp) => {
      this.employees = resp.data.list;
      this.employeesSelected = this.employees;
    });
  }

  submit() {
    this._recognitionService.add(this.itemForm.value).subscribe(
      (result) => {
        if (result == null) {
          this.snack.open("ocurrió un error", "ERROR", { duration: 4000 });
          return;
        }

        if (result.stateCode == 200) {
          this.snack.open(
            "Se envió el reconocimiento de manera correcta",
            "OK",
            { duration: 4000 }
          );
          this._service.disparador.emit();
          this.dialogRef.close(true);
        } else {
          this.snack.open(result.messageError[0], "ERROR", { duration: 4000 });
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  changeEmployee(event) {
    const emp = this.employees.find((emp) => emp.nid_employee === event.value);

    // this.itemForm.get('name').setValue(emp.snames + ' ' + emp.ssurnames );
    // this.itemForm.get('position').setValue(emp.snamecharge );
  }

  onKeyFind(value) {     
    this.employeesSelected = this.search(value);
  }

  search(value: string) { 
    let filter = value.toLowerCase();
    return this.employees.filter(option => (option.nid_person + ' ' + option.snames + ' ' + option.ssurnames).toLowerCase().includes(filter));
  }
}
