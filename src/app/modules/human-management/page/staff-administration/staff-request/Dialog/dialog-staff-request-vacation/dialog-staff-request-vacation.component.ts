import { MatDatepicker } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Component, OnInit, ViewChild, OnDestroy, Inject } from "@angular/core"
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OthersModule } from "@app/views/others/others.module";
import { StaffRequestVacationService } from "@app/data/service/staff-request-vacation.service";
import * as moment from "moment";
import { StaffRequestService } from "@app/data/service/staff-request.service";
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { DatePipe } from "@angular/common";
import { AppDialogMessageService } from "@app/shared/services/AppDialogMessage/app-dialog-message.service";
import { MastertableService } from "@app/data/service/mastertable.service";

@Component({
  selector: "app-dialog-staff-request-vacation",
  templateUrl: "dialog-staff-request-vacation.component.html",
  styleUrls: ["./dialog-staff-request-vacation.component.scss"],
  providers: [DatePipe]
})
export class DialogStaffRequestVacationComponent implements OnInit {
  public itemForm: FormGroup;

  codeEmployee: string = '';
  dateAdmission: string = '';
  fullname: string = '';
  dni: string = '';
  area: string = '';
  charge: string = '';
  nid_personActual;
  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });
  maxDate;
  diasVacaciones: number = 0;
  exactusVacaciones:any;
  events: string[] = [];

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    debugger;
    if (type == 'start') {
      let y = event.value['_i']['year'];
      let m = event.value['_i']['month'];
      let minDate = new Date(y, m, 1);
      this.maxDate = new Date(y, m + 2, 0);
    }
    else if (type == 'end')  {
      this.itemForm.get('startVacation').setValue(this.range.get('start').value);
      this.itemForm.get('endVacation').setValue(this.range.get('end').value);
      this.calculateDay()
    }
  }

  clearDate(event) {
    event.stopPropagation();
    this.range.get('start').setValue(null);
    this.range.get('end').setValue(null);
    this.maxDate = null;
  }

  @ViewChild(MatTable) tableApprover: MatTable<any>;

  today= new Date();
  dayCofigVacation:string='0';
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStaffRequestVacationComponent>,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private staffRequestVacationService: StaffRequestVacationService,
    private staffRequestService: StaffRequestService,
    private datePipe: DatePipe,
    private appDialogMessageService: AppDialogMessageService,
    private mastertableService:MastertableService
  ) {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_personActual = storage.nid_person;
  }

  ngOnInit() {
    this.getVacationsDays();
    this.load();
    this.loadDayConfigVacation();
  }

  validEndDate(): void {
    const valueStart = this.itemForm.get('startVacation').value;
    const valueEnd = this.itemForm.get('endVacation').value;

    if (valueStart != null) {

      const valueStartDate = new Date(valueStart);
      const valueEndDate = new Date(valueEnd);

      const valid = valueEndDate > valueStartDate;

      if (!valid) {
        this.snack.open("¡Es necesario que la fecha fin sea mayor a la fecha inicio!", "OK", { duration: 4000,panelClass: 'center-alert' });
        this.itemForm.get('endVacation').setValue(null)
      } else {
        this.calculateDay();
      }

    } else {
      this.snack.open("¡Es necesario primero seleccionar una fecha inicio!", "OK", { duration: 4000,panelClass: 'center-alert' });
      this.itemForm.get('endVacation').setValue(null)
    }
    
  }

  validStart(): void {
    const valueStart = new Date();
    const valueEnd = this.itemForm.get('startVacation').value;

    const valueEndDate = new Date(valueEnd);

    const valid = valueEndDate > valueStart;

    if (!valid) {
      this.snack.open("¡Es necesario que la fecha sea mayor a la fecha actual!", "OK", { duration: 4000,panelClass: 'center-alert' });
      this.itemForm.get('startVacation').setValue(null)
    }
  }

  stopProp(e) {
    e.stopPropagation();
  }

  buildItemForm(item) {
    
    console.log("🚀 ~ DialogStaffRequestVacationComponent ~ buildItemForm ~ this.data:", this.data)
    this.codeEmployee = this.data.payload.staffRequest.codeEmployee
    this.dateAdmission = this.data.payload.staffRequest.dateAdmission
    this.fullname = this.data.payload.staffRequest.lastName + ' ' + this.data.payload.staffRequest.motherLastName + ' ' + this.data.payload.staffRequest.names
    this.dni = this.data.payload.staffRequest.dni
    this.area = this.data.payload.staffRequest.area
    this.charge = this.data.payload.staffRequest.charge
    item.vacationPeriod = '2022';
    
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
      dni:[item.staffRequest.dni || null],
      dateAdmission: [item.staffRequest.dateAdmission],
      area: [item.staffRequest.area || null],
      startVacation: [item.startVacation || null, Validators.required],
      endVacation: [item.endVacation || null, Validators.required],
      numberCalendarDays: [item.numberCalendarDays || 0],
      numberBusinessDays: [item.numberBusinessDays || 0],
      vacationPeriod: [item.vacationPeriod],
      nnumberoutstandingbalance: [0],
      nnumbertruncatedbalance: [0],
      id: [item.id || 0],
      nid_person: ['']
    });
  }

  submit() {
    
    if (this.itemForm.invalid) {
      this.snack.open("¡Es necesario ingresar todos los datos!", "OK", { duration: 4000, panelClass: 'center-alert' });
      return Object.values(this.itemForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    let todayMonth = moment(new Date()).format('MM');
    let startMonth = moment(this.itemForm.value.startVacation).format('MM');
    let startVacationDate = moment(this.itemForm.value.startVacation).format('YYYY-MM-DD');
    let endVacationDate = moment(this.itemForm.value.endVacation).format('YYYY-MM-DD');
    let permitDateStart = startVacationDate + 'T00:00:00';
    let permitDateEnd = endVacationDate + 'T00:00:00';

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

      const _comparacion = Number(startMonth) < Number(todayMonth);

      if (_comparacion) {
        this.snack.open("¡No puede seleccionar meses anteriores!", "OK", { duration: 4000, panelClass: 'center-alert' });
        return;
      }

      if (!permitido) {
        this.snack.open("¡Fecha no disponible!", "OK", { duration: 4000, panelClass: 'center-alert' });
        return;
      }

      // Verifica si el registro es mayor al dia 26 (Valida por cada mes)
      // this.currentDay = this.datePipe.transform(this.today, 'dd/MM/yyyy');
      let nyear       = this.datePipe.transform(this.today, 'yyyy');
      let nmonth      = this.datePipe.transform(this.today, 'MM');
      let nday       = this.datePipe.transform(this.today, 'dd');
      let totalDays=this.diasEnUnMes(Number(nmonth),Number(nyear));

      if(Number(nday)>=Number(this.dayCofigVacation) && Number(nday)<=totalDays){
        this.appDialogMessageService
          .confirm({
            title: "¡Aviso!",
            message:"Si las solicitudes de vacaciones se registran después del día "+this.dayCofigVacation.toString()+" de cada mes, se reflejarán en la boleta correspondiente al mes siguiente.",
            body: " ",
          })
          .subscribe((result) => {
            if (result) {
              console.log("🚀 ~ DialogStaffRequestVacationComponent ~ .subscribe ~ result:", result)
              this.register();
            }
          });
      }else{
        //validar que la fecha de inicio no sea del mes anterior
        this.register();
      }

     
    });
  }
  loadDayConfigVacation() {
    this.mastertableService.getByIdFather(3689).subscribe(res => {
      console.log("🚀 ~ DialogStaffRequestVacationComponent ~ this.mastertableService.getByIdFather ~ res:", res)
      debugger;
      this.dayCofigVacation = res[0].shortValue;
      
    })
  }
   diasEnUnMes(mes, año) {
    return new Date(año, mes, 0).getDate();
  }
  register()
  {
    let staffRequest = {
      idTypeStaffRequest: this.itemForm.value.idTypeStaffRequest,
      TypeStaffRequest: this.data.payload.TypeStaffRequest,
      staffRequestEmployee: {
        idEmployee: this.itemForm.value.idEmployee,
        idPerson: this.itemForm.value.idPerson,
        idCharge: this.itemForm.value.idCharge,
        idArea : this.itemForm.value.idArea,
        dateAdmission: this.itemForm.value.dateAdmission,
        names: this.itemForm.value.names,
        lastName: this.itemForm.value.lastName,
        motherLastName:this.itemForm.value.motherLastName,
        charge:this.itemForm.value.charge,
        dni:this.itemForm.value.dni
      }
    };
    this.itemForm.get('nid_person').setValue(this.nid_personActual);
    this.itemForm.controls["staffRequest"].setValue(staffRequest);
    if (this.itemForm.value.id == 0) {
      this.staffRequestVacationService.add(this.itemForm.value).subscribe(
        (res) => {
          if (res.stateCode == 200) {
            this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
            this.dialogRef.close(false);
          } else if (res.stateCode == 2) {
            this.snack.open(res.messageError[0], "OK", { duration: 4000,panelClass: 'center-alert' });
          } else {
            this.snack.open("Ocurrio un error en el servidor", "Error", {
              duration: 4000,panelClass: 'center-alert'
            });
          }
        },
        (err) => { },
        () => {
          this.load();
        }
      );
    } else {
      this.staffRequestVacationService.update(this.itemForm.value).subscribe(
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
        (err) => { },
        () => {
          this.load();
        }
      );
    }

  }

  load() {
    this.buildItemForm(this.data.payload);
  }

  calculateDay(){
    let dateVacation = {
      startVacation:this.itemForm.value.startVacation,
      endVacation: this.itemForm.value.endVacation,
    };
    this.staffRequestVacationService.getVacationDayCalculate(dateVacation).subscribe(
      (res) => {
        this.itemForm.controls["numberCalendarDays"].setValue(res.data.numberCalendarDays);
        this.itemForm.controls["numberBusinessDays"].setValue(res.data.numberBusinessDays);
      }
    );    
  }

  getVacationsDays() {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.staffRequestVacationService.GetVacationDays({
      scode_employee: storage.userName,
      idcompany: storage.nid_company
    }).subscribe((res) => {
      // this.diasVacaciones = res.data;
      this.exactusVacaciones = res.data;
      this.diasVacaciones = this.exactusVacaciones.vencido;
      this.itemForm.get('nnumberoutstandingbalance').setValue(this.exactusVacaciones.vencido);
      this.itemForm.get('nnumbertruncatedbalance').setValue(this.exactusVacaciones.trunco);
    }, (err) => {
      console.log('Error getVacationsDays', err);
    });
  }
}
