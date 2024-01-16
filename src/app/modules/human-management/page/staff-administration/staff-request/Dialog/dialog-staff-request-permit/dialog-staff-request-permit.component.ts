import { MatDatepicker } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Component, OnInit, ViewChild, OnDestroy, Inject, ElementRef } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OthersModule } from "@app/views/others/others.module";
import { StaffRequestPermitService } from "@app/data/service/staff-request-permit.service";
import { environment } from "environments/environment.prod";
import { DomSanitizer } from "@angular/platform-browser";
import * as _moment from "moment";
import * as moment from "moment";
import { StaffRequestService } from "@app/data/service/staff-request.service";

@Component({
  selector: "app-dialog-staff-request-permit",
  templateUrl: "dialog-staff-request-permit.component.html",
  styleUrls: ["./dialog-staff-request-permit.component.scss"],
})
export class DialogStaffRequestPermitComponent implements OnInit {
  public itemForm: FormGroup;
  myusername:string="";
  @ViewChild(MatTable) tableApprover: MatTable<any>;
  @ViewChild('fileInput')

  horaInicio: string = '';
  codeEmployee: string = '';
  dateAdmission: string = '';
  fullname: string = '';
  dni: string = '';
  area: string = '';
  charge: string = '';


  fileInput: ElementRef;
  public progress: number;
  public message: string;
  imageURL ='';
  archivoCapturado:any;
  selectedFile: any;
  displayFileName = '';
  lstTypePermit: any[];
  fileName = '';
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStaffRequestPermitComponent>,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private staffRequestPermitService: StaffRequestPermitService,
    private staffRequestService: StaffRequestService
  ) {
  }

  ngOnInit() {
    this.load();
  }

  stopProp(e) {
    e.stopPropagation();
  }

  validTime() {
    let startTime = moment(this.itemForm.value.startTime + " " + this.itemForm.value.startTypeTime, ["h:mm A"]).format("HH:mm");
    let endTime = moment(this.itemForm.value.endTime + " " + this.itemForm.value.endTypeTime, ["h:mm A"]).format("HH:mm");
    
    let permitDate = moment(this.itemForm.value.permitDate).format('YYYY-MM-DD');
    let permitDateStart = permitDate + "T" + startTime + ':00';
    let permitDateEnd = permitDate + "T" + endTime + ':00';

    var ms = moment(permitDateStart).diff(moment(permitDateEnd));
    var d = moment.duration(ms);
    var s = d.asMinutes();

    if (s >= 0) {
      this.snack.open("¡Es necesario que la hora de fin sea mayor a la hora inicial!", "OK", { duration: 4000, panelClass: 'center-alert' });
      this.itemForm.get('endTime').setValue(null)
      return false;
    }
    else {
      return true;
    }
  }

  validDate(): void {
    const valueStart = new Date();
    valueStart.setHours(0, 0, 0, 0);

    const valueEnd = this.itemForm.get('permitDate').value;

    const valueEndDate = new Date(valueEnd);

    const valid = valueEndDate >= valueStart;

    if (!valid) {
      this.snack.open("¡Es necesario que la fecha sea mayor o igual a la fecha actual!", "OK", { duration: 4000, panelClass: 'center-alert' });
      this.itemForm.get('permitDate').setValue(null)
    }
  }

  update(item) {
    item.favorite = true;
  }

  buildItemForm(item) {
    
    this.codeEmployee = this.data.payload.staffRequest.codeEmployee.toString();
    this.dateAdmission = this.data.payload.staffRequest.dateAdmission
    this.fullname = this.data.payload.staffRequest.lastName + ' ' + this.data.payload.staffRequest.motherLastName + ' ' + this.data.payload.staffRequest.names
    this.dni = this.data.payload.staffRequest.dni
    this.area = this.data.payload.staffRequest.area
    this.charge = this.data.payload.staffRequest.charge
    

    this.itemForm = this.fb.group({
      title: [item.title || null],
      idTypeStaffRequest: item.idTypeStaffRequest,
      staffRequest: [null],
      idEmployee: [item.staffRequest.idEmployee || null],
      idPerson:[item.staffRequest.idPerson || null],
      idCharge: [item.staffRequest.idCharge || null],
      idArea: [item.staffRequest.idArea || null],
      lastName: [item.staffRequest.lastName || null],
      motherLastName: [item.staffRequest.motherLastName || null],
      names: [item.staffRequest.names || null],
      charge: [item.staffRequest.charge || null],
      idPermitType: [item.idPermitType || null, Validators.required],
      support: [item.support || null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      dateAdmission: [item.staffRequest.dateAdmission],
      area: [item.staffRequest.area || null],
      dni:[item.staffRequest.dni || null],
      codeEmployee: [item.staffRequest.codeEmployee || null],
      permitDate: [item.permitDate || null, Validators.required],
      startTime: [item.startTime || null, Validators.required],
      startTypeTime: [item.startTypeTime || 'AM', Validators.required],
      endTime: [item.endTime || null, Validators.required],
      endTypeTime: [item.endTypeTime || 'AM', Validators.required],
      id: [item.id || 0],
    });
  }

  submit(files) {
    

    if (this.itemForm.invalid) {
      this.snack.open("¡Es necesario ingresar todos los datos!", "OK", { duration: 4000, panelClass: 'center-alert' });
      return Object.values(this.itemForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    if ( !this.validTime() )
      return;
    
    

    let startTime = moment(this.itemForm.value.startTime + " " + this.itemForm.value.startTypeTime, ["h:mm A"]).format("HH:mm");
    let endTime = moment(this.itemForm.value.endTime + " " + this.itemForm.value.endTypeTime, ["h:mm A"]).format("HH:mm");
    
    let permitDate = moment(this.itemForm.value.permitDate).format('YYYY-MM-DD');
    let permitDateStart = permitDate + "T" + startTime + ':00';
    let permitDateEnd = permitDate + "T" + endTime + ':00';

    let permitido = true;
    this.staffRequestService.ListDatesByEmployee(this.itemForm.value.idEmployee).subscribe(resp => {
      
      resp.data.forEach((item) => {
        
        var ms = moment(permitDateStart).isAfter(moment(item.end_time));

        if(!ms){
          ms = moment(permitDateEnd).isBefore(moment(item.start_time));
          if(!ms)
            permitido = false;
        }

      });

      if (!permitido) {
        this.snack.open("¡Fecha no disponible!", "OK", { duration: 4000, panelClass: 'center-alert' });
        return;
      }
  

      this.register(files);
    });


  }

  register(files) {

    let staffRequest = {
      idTypeStaffRequest: this.itemForm.value.idTypeStaffRequest,
      TypeStaffRequest: this.data.payload.TypeStaffRequest,
      staffRequestEmployee : {
        idEmployee: this.itemForm.value.idEmployee,
        idPerson: this.itemForm.value.idPerson,
        idCharge: this.itemForm.value.idCharge,
        idArea : this.itemForm.value.idArea,
        dateAdmission:this.itemForm.value.dateAdmission,
        names: this.itemForm.value.names,
        lastName: this.itemForm.value.lastName,
        motherLastName:this.itemForm.value.motherLastName,
        charge:this.itemForm.value.charge,
        dni:this.itemForm.value.dni

      }
    };

    
    let startTime = moment(this.itemForm.value.startTime + " " + this.itemForm.value.startTypeTime, ["h:mm A"]).format("HH:mm");
    let endTime = moment(this.itemForm.value.endTime + " " + this.itemForm.value.endTypeTime, ["h:mm A"]).format("HH:mm");

    let permitDate = moment(this.itemForm.value.permitDate).format('YYYY-MM-DD');
    let permitDateStart = permitDate + "T" + startTime + ':00';
    let permitDateEnd = permitDate + "T" + endTime + ':00';

    this.itemForm.controls["startTime"].setValue(permitDateStart);
    this.itemForm.controls["endTime"].setValue(permitDateEnd);

    this.itemForm.controls["staffRequest"].setValue(staffRequest);

    const formData = new FormData();
    for (let file of files){
      formData.append(file.name, file);
    }
    formData.append('data', JSON.stringify(this.itemForm.value));

    if (this.itemForm.value.id == 0) {
      
        this.staffRequestPermitService.add(formData).subscribe(
            (res) => {
              if (res.stateCode == 200) {
                this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
                this.dialogRef.close(false);
              } else if (res.stateCode == 2) {
                this.snack.open(res.messageError[0], "OK", { duration: 4000, panelClass: 'center-alert' });
              } else {
                this.snack.open("Ocurrio un error en el servidor", "Error", {
                  duration: 4000,panelClass: 'center-alert'
                });
              }
            },
            (err) => {},
            () => {
              this.load();
            }
          );
    } else {
      this.staffRequestPermitService.update(this.itemForm.value).subscribe(
        (res) => {
          // this.loader.close();
          if (res.stateCode == 200) {
            this.snack.open("¡Registro Actualizado!", "OK", { duration: 4000 });
            this.dialogRef.close(false);
          } else {
            this.snack.open("Ocurrio un error en el servidor", "Error", {
              duration: 4000,panelClass: 'center-alert'
            });
          }
        },
        (err) => {},
        () => {
          this.load();
        }
      );
    }
  }

  load() {
    this.loadTypePermit();
    this.buildItemForm(this.data.payload);
  }

  deletefile() {
    this.selectedFile = "";
    this.displayFileName = "";
    this.fileInput.nativeElement.value = "";
    return false;
  }

  onFileChanged(event) {
    if (event.target.files.length === 0) {
      return;
    } 
    
    this.selectedFile = event.target.files[0];
    const nombreArchivo = this.selectedFile.name;
    this.fileName = nombreArchivo;

    this.displayFileName = "<span>" + nombreArchivo + "</span>";
    
    if (parseInt((event.target.files[0].size / 1024 / 1024).toFixed(1)) > environment.MaxFileSizeMB) {
      this.selectedFile = "";
      this.displayFileName = "";
      this.snack.open('El tamaño máximo permitido es: ' + environment.MaxFileSizeMB + "MB", 'OK',{ duration: 4000, panelClass: 'center-alert' });

      return;
    }
    this.archivoCapturado=event.target.files[0];
    this.blobFile(this.archivoCapturado).then((res: any) => {
      this.imageURL = res.base;

    });
  }

  blobFile = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          blob: $event,
          image,
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          blob: $event,
          image,
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })

  loadTypePermit() {
    this.staffRequestPermitService.getForSelect().subscribe((res) =>{ 
      
      this.lstTypePermit = res.data;
    });
  }

}
